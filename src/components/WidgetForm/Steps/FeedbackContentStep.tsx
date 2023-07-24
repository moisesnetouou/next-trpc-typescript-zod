import Image from 'next/image';
import { ArrowLeft } from 'phosphor-react';
import { FormEvent, KeyboardEvent, useRef, useState } from 'react';

import { FeedbackType, feedbackTypes } from '..';

import * as z from 'zod';

import { CloseButton } from '../../CloseButton';
import { Loading } from '../../Loading';

const feedbackFormSchema = z.object({
  type: z.enum(['BUG', 'IDEA', 'OTHER']),
  comment: z.string(),
});

export type FeedbackFormSchema = z.infer<typeof feedbackFormSchema>;

export interface FeedbackContentStepProps {
  feedbackType: FeedbackType;
  onFeedbackRestartRequested: () => void;
  onFeedbackSubmitted: (data: FeedbackFormSchema) => void | Promise<void>;
}

export function FeedbackContentStep({
  feedbackType,
  onFeedbackRestartRequested,
  onFeedbackSubmitted,
}: FeedbackContentStepProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [comment, setComment] = useState('');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  function handleSubmitFromTextarea(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      formRef.current?.requestSubmit();
    }
  }

  async function handleSubmitFeedback(event: FormEvent) {
    event.preventDefault();

    setIsSendingFeedback(true);

    const data = feedbackFormSchema.parse({
      type: feedbackType,
      comment,
    });

    await onFeedbackSubmitted(data);

    setIsSendingFeedback(false);
  }

  return (
    <>
      <header>
        <button
          type="button"
          className="absolute top-5 left-5 text-zinc-400 hover:text-zinc-100"
          onClick={onFeedbackRestartRequested}
          title="Voltar"
        >
          <ArrowLeft weight="bold" className="w-4 h-4" />
        </button>
        <span className="flex items-center gap-2 text-xl leading-6">
          <Image
            src={feedbackTypeInfo.image.source}
            alt={feedbackTypeInfo.image.alt}
            className="w-6 h-6"
          />
          {feedbackTypeInfo.title}
        </span>

        <CloseButton />
      </header>

      <form
        ref={formRef}
        className="w-full my-4"
        onSubmit={handleSubmitFeedback}
      >
        <textarea
          className="min-w-[304px] w-full min-h-[95px] text-sm placeholder-zinc-400 text-zinc-100 border-zinc-600 bg-transparent rounded focus:border-brand-500 focus:ring-brand-500 focus:ring-1 focus:outline-none resize-none scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin"
          placeholder="Conte com detalhes o que está acontecendo..."
          onKeyPress={handleSubmitFromTextarea}
          onChange={(event) => setComment(event.target.value)}
        />

        <footer className="flex gap-2 mt-2">
          {/* <ScreenshotButton
            screenshot={screenshot}
            onScreenshotTaken={setScreenshot}
          /> */}

          <button
            type="submit"
            disabled={comment.length === 0 || isSendingFeedback}
            className="flex items-center justify-center flex-1 p-2 text-sm transition-colors border-transparent rounded bg-brand-500 hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500 disabled:opacity-50 disabled:hover:bg-brand-500"
          >
            {isSendingFeedback ? <Loading /> : 'Enviar feedback'}
          </button>
        </footer>
      </form>
    </>
  );
}
