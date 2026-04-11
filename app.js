/* ==========================================================================
   1. 설정 및 도메인 상수 (Configuration & Domain Strategy)
   - 앱 내 하드코딩을 방지하고 비즈니스 룰(건강 기준치, 변환식)을 중앙에서 통제합니다.
   ========================================================================== */
const BMI_THRESHOLDS = {
  UNDERWEIGHT: 18.5,
  HEALTHY: 25.0,
  OVERWEIGHT: 30.0,
};

const HEALTHY_RANGE = {
  MIN_BMI: 18.5,
  MAX_BMI: 24.9,
};

const CONVERSION = {
  CM_TO_M: 100,
  INCHES_PER_FT: 12,
  LBS_PER_ST: 14,
  IMPERIAL_FACTOR: 703,
};

/* ==========================================================================
   2. UI 참조 캐싱 (DOM Element References)
   - 렌더링 최적화를 위해 매번 요소를 찾지 않고 초기 로드 시 한 번만 탐색합니다.
   ========================================================================== */
const metricRadio    = document.getElementById('metric');
const imperialRadio  = document.getElementById('imperial');
const metricDot      = document.getElementById('metric-dot');
const imperialDot    = document.getElementById('imperial-dot');

const metricFields   = document.getElementById('metric-fields');
const imperialFields = document.getElementById('imperial-fields');

const welcomeState   = document.getElementById('welcome-state');
const resultState    = document.getElementById('result-state');

const bmiScoreEl     = document.getElementById('bmi-score');
const bmiClassEl     = document.getElementById('bmi-classification');
const bmiRangeEl     = document.getElementById('bmi-range');

const heightCm = document.getElementById('height-cm');
const weightKg = document.getElementById('weight-kg');

const heightFt  = document.getElementById('height-ft');
const heightIn  = document.getElementById('height-in');
const weightSt  = document.getElementById('weight-st');
const weightLbs = document.getElementById('weight-lbs');

/* ==========================================================================
   3. 순수 도메인 로직 (Pure Business Logic)
   - 화면 구조나 상태에 의존하지 않아 테스트와 재사용이 용이한 계산 모듈입니다.
   ========================================================================== */

/**
 * 미터법(Metric) 단위 시스템에서 사용자의 BMI 지수를 산출합니다.
 * 입력된 단위를 규격화(m, kg)하여 표준 BMI 공식을 적용합니다.
 *
 * @param {number} weightKg - 사용자 체중 (kg 단위)
 * @param {number} heightCm - 사용자 신장 (cm 단위)
 * @returns {number} 산출된 최종 체질량 지수(BMI)
 */
function computeMetricBMI(weightKg, heightCm) {
  const heightM = heightCm / CONVERSION.CM_TO_M;
  return weightKg / Math.pow(heightM, 2);
}

/**
 * 야드파운드법(Imperial) 단위 시스템에서 사용자의 BMI 지수를 산출합니다.
 * 영국/미국권 사용자도 동일한 건강 평가를 받을 수 있도록 별도 계수(703)를 적용합니다.
 *
 * @param {number} totalLbs - 계산을 위해 통합된 전체 체중 파운드 수치
 * @param {number} totalInches - 계산을 위해 통합된 전체 신장 인치 수치
 * @returns {number} 산출된 최종 체질량 지수(BMI)
 */
function computeImperialBMI(totalLbs, totalInches) {
  return (totalLbs / Math.pow(totalInches, 2)) * CONVERSION.IMPERIAL_FACTOR;
}

/**
 * 산출된 BMI 지수를 바탕으로 사용자의 건강 상태 등급을 판별합니다.
 * 국제 보건 기구 등의 표준 임계값(BMI_THRESHOLDS)에 기대어 렌더링에 적합한 문자열을 반환합니다.
 *
 * @param {number} bmi - 공식으로 도출된 순수 BMI 지수
 * @returns {string} 판별된 건강 상태 표기 (예: 'underweight', 'obese')
 */
function getClassification(bmi) {
  if (bmi < BMI_THRESHOLDS.UNDERWEIGHT) return 'underweight';
  if (bmi < BMI_THRESHOLDS.HEALTHY)     return 'a healthy weight';
  if (bmi < BMI_THRESHOLDS.OVERWEIGHT)  return 'overweight';
  return 'obese';
}

/**
 * 사용자의 신장을 기준으로 '건강한 체중'의 범위를 산출해 미터법 포맷(kg)으로 제공합니다.
 * 정상 BMI 범위(18.5 ~ 24.9)를 역산하여 목표 체중의 구간을 사용자에게 가이드합니다.
 *
 * @param {number} heightCm - 기준점 역할을 할 사용자 신장 (cm 단위)
 * @returns {string} 최저~최고 정상체중 권장 범위 통계 문자열 (예: "60.0kgs - 70.0kgs")
 */
function getHealthyRangeMetric(heightCm) {
  const heightM = heightCm / CONVERSION.CM_TO_M;
  const minKg = (HEALTHY_RANGE.MIN_BMI * Math.pow(heightM, 2)).toFixed(1);
  const maxKg = (HEALTHY_RANGE.MAX_BMI * Math.pow(heightM, 2)).toFixed(1);
  return `${minKg}kgs - ${maxKg}kgs`;
}

/**
 * 사용자의 신장을 기준으로 '건강한 체중' 범위를 산출해 야드파운드법 포맷(st/lbs)으로 제공합니다.
 * 스톤(st)과 파운드(lbs)가 혼용되는 임페리얼 기준을 고려해 가독성 있는 문자열로 변환하는 작업을 거칩니다.
 *
 * @param {number} totalInches - 기준점 역할을 할 사용자 신장 (전체 인치 수치)
 * @returns {string} 스톤과 파운드로 구성된 권장 정상체중 구간 문자열
 */
function getHealthyRangeImperial(totalInches) {
  const toLbsStr = (totalLbs) => {
    const st = Math.floor(totalLbs / CONVERSION.LBS_PER_ST);
    const rem = (totalLbs % CONVERSION.LBS_PER_ST).toFixed(1);
    return `${st}st ${rem}lbs`;
  };

  const minLbs = (HEALTHY_RANGE.MIN_BMI * Math.pow(totalInches, 2)) / CONVERSION.IMPERIAL_FACTOR;
  const maxLbs = (HEALTHY_RANGE.MAX_BMI * Math.pow(totalInches, 2)) / CONVERSION.IMPERIAL_FACTOR;
  return `${toLbsStr(minLbs)} - ${toLbsStr(maxLbs)}`;
}

/* ==========================================================================
   4. UI 제어 및 화면 렌더링 (View Controllers)
   - 계산된 결괏값을 문서에 투영하고 컨테이너의 시각적 상태 정보(Display)를 토글합니다.
   ========================================================================== */

/**
 * 활성화된 환경 단위에 맞춰 라디오 버튼 UI의 시각적 포커스(내부 원 트랜지션)를 갱신합니다.
 */
function updateRadioDot() {
  const isMetric = metricRadio.checked;
  metricDot.classList.toggle('scale-0', !isMetric);
  imperialDot.classList.toggle('scale-0', isMetric);
}

/**
 * 측정 시스템(Metric/Imperial) 전환 시 뷰를 리렌더링하는 진입점입니다.
 * 필드 마운트/언마운트 사이클과 함께 기존 세션의 계산 데이터를 초기화하여 혼선을 방지합니다.
 */
function toggleUnit() {
  updateRadioDot();
  const isMetric = metricRadio.checked;
  
  metricFields.classList.toggle('hidden', !isMetric);
  imperialFields.classList.toggle('hidden', isMetric);

  showWelcome();
}

/**
 * 입력값이 누락되었거나 앱 초기 로드시 호출되는 대기 상태 뷰를 노출합니다.
 */
function showWelcome() {
  welcomeState.classList.remove('hidden');
  resultState.classList.add('hidden');
}

/**
 * 연산이 완료된 평가 데이터를 유저에게 최종적으로 피드백하는 Result 컴포넌트를 브로드캐스팅합니다.
 *
 * @param {string|number} bmi - 계산식으로 최종 확정된 BMI 값
 * @param {string} classification - BMI 기준 수치로 결정된 건강 클래스 텍스트 
 * @param {string} range - 목표 달성을 위한 권장 체중 가이드 텍스트
 */
function showResult(bmi, classification, range) {
  bmiScoreEl.textContent = bmi;
  bmiClassEl.textContent = classification;
  bmiRangeEl.textContent = range;
  
  welcomeState.classList.add('hidden');
  resultState.classList.remove('hidden');
}

/* ==========================================================================
   5. 메인 핸들러 및 폼 검증 (Event Handlers & Validation)
   - 유저 액션에 반응해 데이터 무결성을 검증하고 도메인 로직과 뷰 스위칭을 중계합니다.
   ========================================================================== */

/**
 * 키보드/터치 입력이 감지되면 현재 활성화된 시스템 환경에 따라 알맞은 계산 파이프라인으로 라우팅합니다.
 */
function handleCalculateBMI() {
  if (metricRadio.checked) {
    calculateMetric();
  } else {
    calculateImperial();
  }
}

/**
 * [Metric 모드 파이프라인] 폼의 Raw 데이터를 수집, 정합성을 판단한 후 비즈니스 로직을 연결합니다.
 * 최소 요건 결여 시 즉각 대기(Welcome) 상태로 폴백 시킵니다.
 */
function calculateMetric() {
  const h = parseFloat(heightCm.value);
  const w = parseFloat(weightKg.value);

  // 방어 코드 (Defensive Programming): 사용자 오입력이나 공백 시 앱 로직 크래시 방지
  if (!h || !w || h <= 0 || w <= 0) { 
    showWelcome(); 
    return; 
  }

  const bmi = computeMetricBMI(w, h).toFixed(1);
  showResult(
    bmi, 
    getClassification(parseFloat(bmi)), 
    getHealthyRangeMetric(h)
  );
}

/**
 * [Imperial 모드 파이프라인] 분리된 4개의 인풋 필드(ft, in, st, lbs)를 통합 평가 수치로 제어 후, 
 * 연산 및 화면 렌더링 스텝을 지휘합니다.
 */
function calculateImperial() {
  const ft   = parseFloat(heightFt.value)  || 0;
  const inch = parseFloat(heightIn.value)  || 0;
  const st   = parseFloat(weightSt.value)  || 0;
  const lbs  = parseFloat(weightLbs.value) || 0;

  const totalInches = (ft * CONVERSION.INCHES_PER_FT) + inch;
  const totalLbs    = (st * CONVERSION.LBS_PER_ST) + lbs;

  if (totalInches <= 0 || totalLbs <= 0) { 
    showWelcome(); 
    return; 
  }

  const bmi = computeImperialBMI(totalLbs, totalInches).toFixed(1);
  showResult(
    bmi, 
    getClassification(parseFloat(bmi)), 
    getHealthyRangeImperial(totalInches)
  );
}

/* ==========================================================================
   6. 앱 부트스트래핑 (Application Initialization)
   - 문서 환경 로드 직후 트리거되어 기본 앱 생명주기와 이벤트 청취를 가동합니다.
   ========================================================================== */

function init() {
  metricRadio.addEventListener('change', toggleUnit);
  imperialRadio.addEventListener('change', toggleUnit);

  const inputFields = [heightCm, weightKg, heightFt, heightIn, weightSt, weightLbs];
  inputFields.forEach(input => {
    input.addEventListener('input', handleCalculateBMI);
  });

  updateRadioDot();
}

init();
