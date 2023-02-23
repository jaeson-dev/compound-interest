const calculateBtn = document.querySelector('#calculate-btn');
const principalInput = document.querySelector('#principal');
const interestRateInput = document.querySelector('#interest-rate');
const yearsInput = document.querySelector('#years');
const futureValueOutput = document.querySelector('#future-value');
const resultTableBody = document.querySelector('#result-period tbody');
const resultBox = document.querySelector('.result-box');

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

calculateBtn.addEventListener('click', () => {
  const principal = parseFloat(principalInput.value);
  const interestRate = parseFloat(interestRateInput.value) / 100;
  const years = parseInt(yearsInput.value);

  if (principal && interestRate && years) {
    const futureValue = principal * Math.pow(1 + interestRate, years);
    futureValueOutput.textContent = `미래가치: ${futureValue.toLocaleString()}원`;

    resultTableBody.innerHTML = '';
    const principalArray = [principal];
    const interestArray = [0];
    const totalArray = [principal];

    for (let i = 1; i <= years; i++) {
      const interest = totalArray[i - 1] * interestRate;
      const principal = totalArray[i - 1];
      const total = principal + interest;
      principalArray.push(principal);
      interestArray.push(interest);
      totalArray.push(total);
      const row = document.createElement('tr');
      row.innerHTML = `<td>${i}</td><td>${numberWithCommas(
        Math.round(principal)
      )}</td><td>${numberWithCommas(
        Math.round(interest)
      )}</td><td>${numberWithCommas(Math.round(total))}</td>`;
      resultTableBody.appendChild(row);
    }
    resultBox.style.display = 'block';
  } else {
    return;
  }
});

// API 엔드포인트
const apiUrl =
  'https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD';

// API 호출 함수
function getExchangeRate() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // API에서 가져온 환율 정보를 화면에 표시
      const rate = data[0].basePrice;
      document.getElementById('rate').textContent = rate;
    })
    .catch((error) => {
      console.error(error);
    });
}

// 환율 계산 함수
function convertCurrency(rate, krw) {
  return (krw / rate).toFixed(2);
}

// 원화 입력란 이벤트 처리
document.getElementById('krw-input').addEventListener('input', function () {
  var rate = document.getElementById('rate').textContent.replace(',', '');
  var krw = this.value;
  var usd = convertCurrency(rate, krw);
  document.getElementById('usd-input').value = usd;
});

// 달러 입력란 이벤트 처리
document.getElementById('usd-input').addEventListener('input', function () {
  var rate = document.getElementById('rate').textContent.replace(',', '');
  var usd = this.value;
  var krw = convertCurrency(1 / rate, usd);
  document.getElementById('krw-input').value = krw;
});

// 페이지 로드 완료 후 환율 정보 가져오기
window.addEventListener('load', function () {
  getExchangeRate();
});
