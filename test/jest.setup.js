beforeEach(() => {
  if (!console.error.mock) {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  }
  if (!console.log.mock) {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  }
});

afterEach(() => {
  if (console.error.mockRestore) {
    console.error.mockRestore();
  }
  if (console.log.mockRestore) {
    console.log.mockRestore();
  }
});
