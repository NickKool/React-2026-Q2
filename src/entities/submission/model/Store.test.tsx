import { useSubmissionStore } from './store';

describe('useSubmissionStore', () => {
  beforeEach(() => {
    useSubmissionStore.setState({
      submissions: [],
      latestSubmissionId: null,
    });
  });

  it('should have initial state with empty submissions and default countries list', () => {
    const state = useSubmissionStore.getState();

    expect(state.submissions).toEqual([]);
    expect(state.latestSubmissionId).toBeNull();
    expect(state.countries).toEqual([
      'Belarus',
      'Russia',
      'Kazakhstan',
      'Georgia',
      'Armenia',
      'Poland',
      'Germany',
    ]);
  });

  it('should successfully add a new submission to the beginning of the history list', () => {
    const mockSubmissionData = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
      gender: 'male' as const,
      country: 'Germany',
      imageBas64: 'data:image/png;base64,mockdata',
    };

    const generatedId = useSubmissionStore.getState().addSubmission(mockSubmissionData);

    const state = useSubmissionStore.getState();
    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0]).toMatchObject(mockSubmissionData);
    expect(state.submissions[0].id).toBe(generatedId);
    expect(state.submissions[0].timestamp).toBeLessThanOrEqual(Date.now());
    expect(state.latestSubmissionId).toBe(generatedId);
  });

  it('should keep track of previous records when a new submission is added', () => {
    const store = useSubmissionStore.getState();
    
    const record1 = {
      name: 'Alice',
      age: 25,
      email: 'alice@example.com',
      gender: 'female' as const,
      country: 'Poland',
      imageBas64: 'data:image/png;base64,mock1',
    };

    const record2 = {
      name: 'Bob',
      age: 28,
      email: 'bob@example.com',
      gender: 'male' as const,
      country: 'Belarus',
      imageBas64: 'data:image/png;base64,mock2',
    };

    store.addSubmission(record1);
    const secondId = useSubmissionStore.getState().addSubmission(record2);

    const state = useSubmissionStore.getState();
    expect(state.submissions).toHaveLength(2);
    expect(state.submissions[0].id).toBe(secondId);
    expect(state.submissions[0].name).toBe('Bob');
    expect(state.submissions[1].name).toBe('Alice');
    expect(state.latestSubmissionId).toBe(secondId);
  });

  it('should update latestSubmissionId state via setLatestSubmissionId action', () => {
    useSubmissionStore.getState().setLatestSubmissionId('custom-uuid-123');
    expect(useSubmissionStore.getState().latestSubmissionId).toBe('custom-uuid-123');

    useSubmissionStore.getState().setLatestSubmissionId(null);
    expect(useSubmissionStore.getState().latestSubmissionId).toBeNull();
  });
});
