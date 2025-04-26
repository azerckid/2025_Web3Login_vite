# 2025_Web3Login_vite

Solana(Phantom)와 Ethereum(MetaMask) 지갑을 모두 지원하는 Web3 로그인 데모 프로젝트입니다. 

- Solana, Ethereum 지갑 연결 및 계정 표시
- SOL, ETH 및 대표 토큰(USDC, USDT, DAI 등) 잔액 조회
- Alchemy RPC를 통한 빠르고 안정적인 네트워크 연결
- Vite + React 기반

## 데모 화면
![demo](./screenshot.png)

## 환경 변수 설정

1. 프로젝트 루트에 있는 `.env.example` 파일을 복사하여 `.env`로 이름을 바꿉니다.
2. 각 항목에 실제 값을 입력하세요.

```bash
cp .env.example .env
```

- `VITE_SOLANA_RPC_URL` : Solana RPC 엔드포인트(예: Alchemy)
- `VITE_ETHEREUM_RPC_URL` : Ethereum RPC 엔드포인트(예: Alchemy)

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 주요 기능
- Solana(Phantom) 및 Ethereum(MetaMask) 지갑 연결/해제
- 연결된 계정 주소 및 잔액(코인, 대표 토큰) 표시
- 환경변수로 RPC 주소 관리
- 반응형 UI, 직관적인 UX

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 LICENSE 파일을 참고하세요.
