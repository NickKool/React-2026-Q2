import { convertToBase64 } from './file';

describe('convertToBase64 utility', () => {
  it('should successfully convert a valid File object into a base64 encoded data URI string', async () => {
    const mockFileContent = 'hello world';
    const mockFile = new File([mockFileContent], 'test.txt', { type: 'text/plain' });

    const result = await convertToBase64(mockFile);

    expect(result).toContain('data:text/plain;base64,');
    expect(typeof result).toBe('string');
  });

  it('should reject the promise when a FileReader error event occurs', async () => {
    const mockFile = new File([''], 'corrupted.png', { type: 'image/png' });
    
    const spyReadAsDataURL = vi.spyOn(FileReader.prototype, 'readAsDataURL');
    
    spyReadAsDataURL.mockImplementation(function (this: FileReader) {
      queueMicrotask(() => {
        if (this.onerror) {
          const mockErrorEvent = new ProgressEvent('error') as unknown as ProgressEvent<FileReader>;
          this.onerror(mockErrorEvent);
        }
      });
    });

    try {
      await convertToBase64(mockFile);
      expect(true).toBe(false);
    } catch (error) {
      const event = error as ProgressEvent;
      expect(event.type).toBe('error');
    }
    
    spyReadAsDataURL.mockRestore();
  });
});
