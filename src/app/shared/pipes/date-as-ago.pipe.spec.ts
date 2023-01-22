import { DateAsAgoPipe } from './date-as-ago.pipe';

describe('DateAsAgoPipe', () => {
  let pipe: DateAsAgoPipe;
  beforeEach(() => {
    pipe = new DateAsAgoPipe();
  });
  it('should return "just now" if the value is less than 10 seconds', () => {
    const result = pipe.transform(new Date(Date.now() - 5 * 1000));
    expect(result).toEqual('just now');
  });
  it('should return "a moment ago" if the value is less than 1 minute', () => {
    const result = pipe.transform(new Date(Date.now() - 30 * 1000));
    expect(result).toEqual('a moment ago');
  });
  it('should return the correct time in seconds if the value is more than 1 minute ago', () => {
    const result = pipe.transform(new Date(Date.now() - 65 * 1000));
    expect(result).toEqual('1 minute ago');
  });
  it('should return the correct time in minutes if the value is more than 1 hour ago', () => {
    const result = pipe.transform(new Date(Date.now() - 65 * 60 * 1000));
    expect(result).toEqual('1 hour ago');
  });
  it('should return the correct time in hours if the value is more than 1 day ago', () => {
    const result = pipe.transform(new Date(Date.now() - 25 * 60 * 60 * 1000));
    expect(result).toEqual('1 day ago');
  });
  it('should return the correct time in days if the value is more than 1 month ago', () => {
    const result = pipe.transform(
      new Date(Date.now() - 35 * 24 * 60 * 60 * 1000)
    );
    expect(result).toEqual('1 month ago');
  });
  it('should return the correct time in months if the value is more than 1 year ago', () => {
    const result = pipe.transform(
      new Date(Date.now() - 20 * 30 * 24 * 60 * 60 * 1000)
    );
    expect(result).toEqual('1 year ago');
  });
});
