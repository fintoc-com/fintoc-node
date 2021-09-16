export async function* getGenerator() {
  for (let index = 0; index < 10; index += 1) {
    yield {
      id: 'obj_3nlaf830FBbfF83',
      name: 'Sample Name',
      number: index,
    };
  }
}
