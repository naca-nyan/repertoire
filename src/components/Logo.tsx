import React from "react";

type Props = {
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Repertoire のロゴ。
 * 英字「Repertoire」の右下に、同じ色でカタカナ「レパートリー」を添えています。
 * 色は currentColor を継承します。
 */
const Logo: React.FC<Props> = ({ height = 40, className, style }) => (
  <svg
    viewBox="0 0 220 62"
    role="img"
    aria-label="Repertoire（レパートリー）"
    className={className}
    style={{ display: "block", height, width: "auto", ...style }}
  >
    <title>Repertoire（レパートリー）</title>
    <text
      x="0"
      y="41"
      textLength="202"
      lengthAdjust="spacing"
      fontFamily="Inter, 'Helvetica Neue', Arial, sans-serif"
      fontSize="40"
      fontWeight="600"
      letterSpacing="-0.5"
      fill="currentColor"
    >
      Repertoire
    </text>
    <text
      x="220"
      y="58"
      textAnchor="end"
      fontFamily="'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif"
      fontSize="19"
      fontWeight="600"
      letterSpacing="2.5"
      fill="currentColor"
    >
      レパートリー
    </text>
  </svg>
);

export default Logo;
