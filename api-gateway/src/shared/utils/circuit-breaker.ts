import CircuitBreaker from 'opossum';

export const circuitBreakerOptions = {
  timeout: 5000, // If operation takes longer than 5 seconds, trigger failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again
};

export function withCircuitBreaker<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options = circuitBreakerOptions,
): (...args: T) => Promise<R> {
  const breaker = new CircuitBreaker(fn, options);

  breaker.on('open', () => console.log('Circuit breaker opened'));
  breaker.on('close', () => console.log('Circuit breaker closed'));
  breaker.on('halfOpen', () => console.log('Circuit breaker half-open'));

  return breaker.fire.bind(breaker);
}
