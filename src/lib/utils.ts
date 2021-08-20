export function toTitle(rawString: string) {
  return rawString[0].toUpperCase() + rawString.substr(1).toLowerCase();
}

export function snakeToPascal(snakeString: string) {
  return snakeString.split('_').map(toTitle).join('');
}

export function singularize(rawString: string) {
  return rawString.replace(/s$/, '');
}

export function isISODate(rawDate: string) {
  return !Number.isNaN(Date.parse(rawDate));
}

export function canRaiseHTTPError(
  _: unknown, __: string, descriptor: TypedPropertyDescriptor<any>,
) {
  const newDescriptor = { ...descriptor };

  newDescriptor.value = function wrapper(...args: any[]) {
    try {
      return descriptor.value.apply(this, args);
    } catch (error) {
      throw new Error('F');
    }
  };

  return newDescriptor;
}
