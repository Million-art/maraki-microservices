export class QuizDeletedEvent {
  constructor(
    public readonly quizId: string,
    public readonly title: string,
  ) {}
}
