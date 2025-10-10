export class QuizCreatedEvent {
  constructor(
    public readonly quizId: string,
    public readonly title: string,
    public readonly category?: string,
  ) {}
}
