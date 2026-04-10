// ── DOM 요소 참조 ──
const metricRadio    = document.getElementById('metric');
const imperialRadio  = document.getElementById('imperial');
const metricFields   = document.getElementById('metric-fields');
const imperialFields = document.getElementById('imperial-fields');
const welcomeState   = document.getElementById('welcome-state');
const resultState    = document.getElementById('result-state');
const bmiScoreEl     = document.getElementById('bmi-score');
const bmiClassEl     = document.getElementById('bmi-classification');
const bmiRangeEl     = document.getElementById('bmi-range');

// 커스텀 라디오 내부 점
const metricDot   = document.getElementById('metric-dot');
const imperialDot = document.getElementById('imperial-dot');

// Metric 입력창
const heightCm = document.getElementById('height-cm');
const weightKg = document.getElementById('weight-kg');

// Imperial 입력창
const heightFt  = document.getElementById('height-ft');
const heightIn  = document.getElementById('height-in');
const weightSt  = document.getElementById('weight-st');
const weightLbs = document.getElementById('weight-lbs');

// ── 커스텀 라디오 버튼 내부 점 업데이트 ──
// (CSS peer-checked는 형제 요소에만 적용되므로, 손자 요소인 내부 점은 JS로 제어)
function updateRadioDot() {
  if (metricRadio.checked) {
    metricDot.classList.remove('scale-0');
    imperialDot.classList.add('scale-0');
  } else {
    imperialDot.classList.remove('scale-0');
    metricDot.classList.add('scale-0');
  }
}

// ── 단위 전환: 입력 필드 표시/숨김 ──
function toggleUnit() {
  updateRadioDot();

  if (metricRadio.checked) {
    metricFields.classList.remove('hidden');
    imperialFields.classList.add('hidden');
  } else {
    metricFields.classList.add('hidden');
    imperialFields.classList.remove('hidden');
  }

  // 단위가 바뀌면 입력값과 결과를 초기화
  showWelcome();
}

// ── BMI 수치 → 건강 상태 분류 ──
function getClassification(bmi) {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25.0) return 'a healthy weight';
  if (bmi < 30.0) return 'overweight';
  return 'obese';
}

// ── Metric 기준 이상적인 체중 범위 계산 (단위: kg) ──
function getHealthyRangeMetric(heightCmVal) {
  const h     = heightCmVal / 100;
  const minKg = (18.5 * h * h).toFixed(1);
  const maxKg = (24.9 * h * h).toFixed(1);
  return `${minKg}kgs - ${maxKg}kgs`;
}

// ── Imperial 기준 이상적인 체중 범위 계산 (단위: st, lbs) ──
function getHealthyRangeImperial(totalInches) {
  const toLbsStr = (lbs) => {
    const st  = Math.floor(lbs / 14);
    const rem = (lbs % 14).toFixed(1);
    return `${st}st ${rem}lbs`;
  };
  const minLbs = (18.5 * totalInches * totalInches) / 703;
  const maxLbs = (24.9 * totalInches * totalInches) / 703;
  return `${toLbsStr(minLbs)} - ${toLbsStr(maxLbs)}`;
}

// ── Welcome 화면 표시 (입력값 없을 때) ──
function showWelcome() {
  welcomeState.classList.remove('hidden');
  resultState.classList.add('hidden');
}

// ── 결과 화면 표시 ──
function showResult(bmi, classification, range) {
  bmiScoreEl.textContent = bmi;
  bmiClassEl.textContent = classification;
  bmiRangeEl.textContent = range;
  welcomeState.classList.add('hidden');
  resultState.classList.remove('hidden');
}

// ── BMI 계산 메인 함수 (input 이벤트마다 호출) ──
function calculateBMI() {
  if (metricRadio.checked) {
    // Metric 공식: BMI = 몸무게(kg) ÷ 키(m)²
    const h = parseFloat(heightCm.value);
    const w = parseFloat(weightKg.value);

    if (!h || !w || h <= 0 || w <= 0) { showWelcome(); return; }

    const bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
    showResult(bmi, getClassification(parseFloat(bmi)), getHealthyRangeMetric(h));

  } else {
    // Imperial 공식: BMI = (몸무게(lbs) ÷ 키(in)²) × 703
    const ft   = parseFloat(heightFt.value)  || 0;
    const inch = parseFloat(heightIn.value)  || 0;
    const st   = parseFloat(weightSt.value)  || 0;
    const lbs  = parseFloat(weightLbs.value) || 0;

    const totalInches = (ft * 12) + inch;
    const totalLbs    = (st * 14) + lbs;

    if (totalInches <= 0 || totalLbs <= 0) { showWelcome(); return; }

    const bmi = ((totalLbs / Math.pow(totalInches, 2)) * 703).toFixed(1);
    showResult(bmi, getClassification(parseFloat(bmi)), getHealthyRangeImperial(totalInches));
  }
}

// ── 이벤트 리스너 연결 ──

// 라디오 버튼 변경 → 단위 전환
metricRadio.addEventListener('change', toggleUnit);
imperialRadio.addEventListener('change', toggleUnit);

// 모든 입력창 → 값 바뀌는 즉시 BMI 계산
[heightCm, weightKg, heightFt, heightIn, weightSt, weightLbs].forEach(input => {
  input.addEventListener('input', calculateBMI);
});

// 페이지 첫 로드 시 초기 상태 세팅
updateRadioDot();
