import { isInArray, required } from '..';

describe('Utils | Params', () => {
  describe('required', () => {
    it('throws if a required error is missing', () => {
      const myFunction = (param = required()) => param;
      const test = () => myFunction();
      expect(test).to.throw;
    });

    it('does not throw if a required param is passed', () => {
      const myFunction = (param = required()) => param;
      const test = () => myFunction(5);
      expect(test()).to.eql(5);
    });
  });

  describe('isInArray', () => {
    it('returns false if not in array', () => {
      const array = [1, 2, 3];

      expect(isInArray(array, 4)).to.eql(false);
      expect(isInArray(array, '4')).to.eql(false);
      expect(isInArray(array, 'abc')).to.eql(false);
    });

    it('returns true if in array', () => {
      const array = [123, 234, '345'];

      expect(isInArray(array, 123)).to.eql(true);
      expect(isInArray(array, '123')).to.eql(true);

      expect(isInArray(array, '345')).to.eql(true);
      expect(isInArray(array, 345)).to.eql(true);
    });
  });
});
