import { $, show, hide, inputNotValid } from './DOM-utils/DOM-utils';
import { sendRequest, manageRequestResponse } from './request-utils/request-utils';
import environment from './environment';

export default () => {
  const loader = $('#loader');

  const textInput = $('#text');
  const analyzeBtn = $('#analyze-btn');

  const analysisContainer = $('#analysis-container');
  const confidenceInput = $('#confidence');
  const scoreInput = $('#score');
  const agreementInput = $('#agreement');
  const subjectivityInput = $('#subjectivity');
  const ironyInput = $('#irony');

  const isProd = environment.MODE === 'PROD';

  async function analyseText(e) {
    try {
      if (inputNotValid(textInput)) {
        throw new Error('Validation error: input was not valid');
      }
      e.preventDefault();
      show(loader);
      const escapedText = escape(textInput.value)
      const url = `${environment.APIURL}?text=${escapedText}`;
      const analysisRequest = await sendRequest(url, isProd);
      const analysisResponse = await manageRequestResponse(
        analysisRequest,
        response => !response.ok,
        response => response.status === 400 ? alert('Sorry, we could not analyze this text: try with a longer sentence') : null);
      renderResponse(analysisResponse);
      show(analysisContainer);
    } catch (e) {
      alert('Something went wrong :(')
    } finally {
      hide(loader)
    }

    function renderResponse(response) {
      confidenceInput.innerText = response.confidence;
      scoreInput.innerText = response.score_tag;
      agreementInput.innerText = response.agreement.toLowerCase();
      subjectivityInput.innerText = response.subjectivity.toLowerCase();
      ironyInput.innerText = response.irony.toLowerCase();
    }
  }
  analyzeBtn.addEventListener('click', analyseText);
}
