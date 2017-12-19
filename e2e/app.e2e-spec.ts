import { PredictiveSearchPage } from './app.po';

describe('predictive-search App', function() {
  let page: PredictiveSearchPage;

  beforeEach(() => {
    page = new PredictiveSearchPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
