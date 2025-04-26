# 2025_Web3Login_vite

Solana(Phantom)와 Ethereum(MetaMask) 지갑을 모두 지원하는 Web3 로그인 데모 프로젝트입니다. 

- Solana, Ethereum 지갑 연결 및 계정 표시
- SOL, ETH 및 대표 토큰(USDC, USDT, DAI 등) 잔액 조회
- Alchemy RPC를 통한 빠르고 안정적인 네트워크 연결
- Vite + React 기반

## 데모 화면
![demo](./screenshot.png)

## 설치 및 실행

```bash
# 의존성 설치
npm install

# .env 파일 생성 (RPC 주소 입력)
cp .env.example .env
# .env 파일에 아래와 같이 입력
# VITE_SOLANA_RPC_URL=... (예: Alchemy Solana RPC)
# VITE_ETHEREUM_RPC_URL=... (예: Alchemy Ethereum RPC)

# 개발 서버 실행
npm run dev
```

## 환경변수(.env 예시)
```
VITE_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/your-key
VITE_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-key
```

## 주요 기능
- Solana(Phantom) 및 Ethereum(MetaMask) 지갑 연결/해제
- 연결된 계정 주소 및 잔액(코인, 대표 토큰) 표시
- 환경변수로 RPC 주소 관리
- 반응형 UI, 직관적인 UX

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 LICENSE 파일을 참고하세요.
