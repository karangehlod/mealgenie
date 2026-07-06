import { describe, it, expect, beforeEach } from 'vitest';
import { usePlannerStore } from './usePlannerStore';
import type { DayContext } from '../types';

describe('usePlannerStore', () => {
  beforeEach(() => {
    usePlannerStore.getState().reset();
  });

  it('should initialize with default null/false state', () => {
    const state = usePlannerStore.getState();
    expect(state.dayContext).toBeNull();
    expect(state.mealPlan).toBeNull();
    expect(state.groceryList).toBeNull();
    expect(state.substitutions).toBeNull();
    expect(state.budgetCheck).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should update dayContext state', () => {
    const mockContext: DayContext = {
      diet: ['Vegan'],
      budget: 30,
      cookingTime: 45,
      allergies: ['Nuts'],
      ingredientsToAvoid: 'Cilantro',
      preferredCuisine: 'Mexican',
      additionalNotes: 'Keep it light',
      servings: 2,
    };

    usePlannerStore.getState().setDayContext(mockContext);
    expect(usePlannerStore.getState().dayContext).toEqual(mockContext);
  });

  it('should update loading and error states', () => {
    usePlannerStore.getState().setLoading(true);
    expect(usePlannerStore.getState().loading).toBe(true);

    usePlannerStore.getState().setError('Something went wrong');
    expect(usePlannerStore.getState().error).toBe('Something went wrong');
  });

  it('should reset state correctly', () => {
    usePlannerStore.getState().setLoading(true);
    usePlannerStore.getState().setError('Error');
    usePlannerStore.getState().reset();

    const state = usePlannerStore.getState();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
