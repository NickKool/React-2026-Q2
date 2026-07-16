# Performance Optimization Report

## Baseline Measurements

### Interaction A: Sort countries

- **Commit duration**: 2.5 s
- **Render duration**: 495.3 ms
- **Screenshot**: ![screenshot](screenshots/baseline/Countries.png)

### Interaction B: Search countries

- **Commit duration**: 2.8 s
- **Render duration**: 209.7 ms
- **Screenshot**: ![screenshot](screenshots/baseline/Search.png)

### Interaction C: Change year

- **Commit duration**: 3.2 s
- **Render duration**: 513.5 ms
- **Screenshot**: ![screenshot](screenshots/baseline/Year.png)

### Interaction D: Toggle column

- **Commit duration**: 3.4 s
- **Render duration**: 569.1 ms
- **Screenshot**: ![screenshot](screenshots/baseline/Columns.png)






## Optimized Measurements

### Interaction A: Sort countries

- **Commit duration**: 2.1 s
- **Render duration**: 84.6 ms
- **Screenshot**: ![screenshot](screenshots/optimized/CountriesOpt.png)

### Interaction B: Search countries

- **Commit duration**: 2.3 s
- **Render duration**: 30.7 ms
- **Screenshot**: ![screenshot](screenshots/optimized/SearchOpt.png)

### Interaction C: Change year

- **Commit duration**: 3.6 s
- **Render duration**: 115.4 ms
- **Screenshot**: ![screenshot](screenshots/optimized/YearOpt.png)

### Interaction D: Toggle column

- **Commit duration**: 0.8 s
- **Render duration**: 20.1 ms
- **Screenshot**: ![screenshot](screenshots/optimized/ColumnsOpt.png)

## Summary of Improvements

| Interaction      | Baseline (ms) | Optimized (ms) | Improvement |
| ---------------- | ------------- | -------------- | ----------- |
| Sort countries   | 495.3         | 84.6           | 82.9%       |
| Search countries | 209.7         | 30.7           | 85.4%       |
| Change year      | 513.5         | 115.4          | 77.5%       |
| Toggle column    | 569.1         | 20.1           | 96.5%       |
| **Average**      | **446.9**     | **62.7**       | **86.0%**   |