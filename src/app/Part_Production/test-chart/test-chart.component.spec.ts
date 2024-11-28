import { TestBed } from '@angular/core/testing';
import { TestChartComponent } from './test-chart.component';

describe('TestChartComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TestChartComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TestChartComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ng2-charts-demo'`, () => {
    const fixture = TestBed.createComponent(TestChartComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ng2-charts-demo');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(TestChartComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('ng2-charts-demo app is running!');
  });
});
