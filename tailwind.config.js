tailwind.config = {
  theme: {
    extend: {
      colors: {
        blue: {
          100: '#E1E7FE',
          300: '#B3D3F1',
          500: '#345FF6',
          900: '#253347',
        },
        grey: {
          300: '#ACC1DE',
          500: '#5E6E85',
        },
      },
      backgroundImage: {
        'gradient-1': 'linear-gradient(to right, #D6FCFE, #D6E6FE)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // 기본 글씨체를 Inter로 설정해요!
      },
      fontSize: {
        'preset-1': ['64px', { lineHeight: '110%', letterSpacing: '-0.05em', fontWeight: '600' }],
        'preset-2': ['48px', { lineHeight: '110%', letterSpacing: '-0.05em', fontWeight: '600' }],
        'preset-3': ['32px', { lineHeight: '110%', letterSpacing: '-0.05em', fontWeight: '600' }],
        'preset-4': ['24px', { lineHeight: '120%', letterSpacing: '-0.05em', fontWeight: '600' }],
        'preset-5': ['20px', { lineHeight: '120%', letterSpacing: '-0.05em', fontWeight: '600' }],
        'preset-6-semibold': ['16px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '600' }],
        'preset-6-regular': ['16px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '400' }],
        'preset-7-bold': ['14px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '700' }],
        'preset-7-regular': ['14px', { lineHeight: '150%', letterSpacing: '0px', fontWeight: '400' }],
      },
      spacing: {
        '0': '0px',
        '100': '8px',
        '200': '16px',
        '300': '24px',
        '400': '32px',
        '500': '40px',
        '600': '48px',
        '700': '56px',
        '900': '72px',
        '1100': '88px',
        '1200': '96px',
        '1300': '104px',
        '1600': '128px',
        '1800': '144px',
      }
    }
  }
}
