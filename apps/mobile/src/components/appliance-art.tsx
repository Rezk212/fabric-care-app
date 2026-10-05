import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { useApp } from '../lib/app-context';

/**
 * Simple drawings of each kind of washer and dryer, in the app's colours. They show the machine class
 * (door on the front or lid on top, hose, water tank…), not a particular brand or model.
 */
export function ApplianceArt({ typeId, size = 64 }: { typeId?: string; size?: number }) {
  const { colors } = useApp();
  const ink = colors.ink;
  const body = colors.surface;
  const glass = colors.primary;
  const soft = colors.primarySoft;
  const acc = colors.accent;
  const sw = 2.4;

  const Body = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
    <Rect x={x} y={y} width={w} height={h} rx={8} fill={body} stroke={ink} strokeWidth={sw} />
  );
  const Panel = ({ x, y, w, wind }: { x: number; y: number; w: number; wind?: boolean }) => (
    <G>
      <Line x1={x} y1={y + 14} x2={x + w} y2={y + 14} stroke={ink} strokeWidth={1.6} opacity={0.5} />
      <Circle cx={x + 11} cy={y + 7} r={3} fill={ink} opacity={0.75} />
      <Circle cx={x + 21} cy={y + 7} r={3} fill={ink} opacity={0.75} />
      {wind ? (
        <G stroke={acc} strokeWidth={1.8} strokeLinecap="round" fill="none">
          <Path d={`M${x + w - 24} ${y + 4}c4-3 6 3 10 0`} />
          <Path d={`M${x + w - 24} ${y + 9}c4-3 6 3 10 0`} />
        </G>
      ) : (
        <Rect x={x + w - 22} y={y + 4} width={14} height={6} rx={2} fill={acc} />
      )}
    </G>
  );
  const Door = ({ cx, cy, r, wave = true }: { cx: number; cy: number; r: number; wave?: boolean }) => (
    <G>
      <Circle cx={cx} cy={cy} r={r} fill={soft} stroke={ink} strokeWidth={sw} />
      <Circle cx={cx} cy={cy} r={r * 0.68} fill={glass} opacity={0.28} />
      {wave ? <Path d={`M${cx - r * 0.5} ${cy + 1}c${r * 0.2}-${r * 0.35} ${r * 0.4} ${r * 0.35} ${r * 0.5} 0s${r * 0.3}-${r * 0.3} ${r * 0.5} 0`} stroke={acc} strokeWidth={2.4} strokeLinecap="round" fill="none" /> : null}
    </G>
  );
  const Top = ({ x, w }: { x: number; w: number }) => (
    <G>
      <Rect x={x} y={8} width={w} height={18} rx={6} fill={body} stroke={ink} strokeWidth={sw} />
      <Circle cx={x + 11} cy={17} r={3} fill={ink} opacity={0.75} />
      <Circle cx={x + 21} cy={17} r={3} fill={ink} opacity={0.75} />
      <Rect x={x + w - 22} y={14} width={14} height={6} rx={2} fill={acc} />
    </G>
  );

  let art: React.ReactNode;
  switch (typeId) {
    case 'front-load':
    case 'washer-dryer':
      art = (<><Body x={16} y={8} w={64} h={80} /><Panel x={16} y={10} w={64} wind={typeId === 'washer-dryer'} /><Door cx={48} cy={58} r={21} /></>);
      break;
    case 'front-load-compact':
      art = (<><Body x={22} y={22} w={52} h={66} /><Panel x={22} y={24} w={52} /><Door cx={48} cy={64} r={15} /></>);
      break;
    case 'built-in-washer':
      art = (
        <>
          <Rect x={8} y={12} width={80} height={78} rx={6} fill={soft} stroke={ink} strokeWidth={sw} />
          <Line x1={4} y1={12} x2={92} y2={12} stroke={ink} strokeWidth={4} strokeLinecap="round" />
          <Rect x={16} y={22} width={64} height={60} rx={6} fill={body} stroke={ink} strokeWidth={1.8} />
          <Circle cx={48} cy={54} r={14} fill={soft} stroke={ink} strokeWidth={sw} />
          <Circle cx={48} cy={54} r={9} fill={glass} opacity={0.28} />
          <Line x1={30} y1={30} x2={66} y2={30} stroke={ink} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
        </>
      );
      break;
    case 'top-load-agitator':
    case 'top-load-impeller':
      art = (
        <>
          <Body x={18} y={22} w={60} h={66} />
          <Top x={18} w={60} />
          <Rect x={24} y={32} width={48} height={20} rx={6} fill={soft} stroke={ink} strokeWidth={1.8} />
          <Circle cx={48} cy={42} r={7} fill={glass} opacity={0.3} stroke={ink} strokeWidth={1.4} />
          {typeId === 'top-load-agitator' ? <Line x1={48} y1={37} x2={48} y2={47} stroke={ink} strokeWidth={2.4} strokeLinecap="round" /> : <Circle cx={48} cy={42} r={3} fill={acc} />}
        </>
      );
      break;
    case 'twin-tub':
      art = (
        <>
          <Body x={8} y={26} w={80} h={60} />
          <Rect x={8} y={12} width={80} height={16} rx={6} fill={body} stroke={ink} strokeWidth={sw} />
          <Circle cx={22} cy={20} r={3} fill={ink} opacity={0.75} />
          <Circle cx={32} cy={20} r={3} fill={ink} opacity={0.75} />
          <Circle cx={30} cy={58} r={16} fill={soft} stroke={ink} strokeWidth={sw} />
          <Circle cx={30} cy={58} r={10} fill={glass} opacity={0.28} />
          <Path d="M23 58c2-3 4 3 7 0s4 3 7 0" stroke={acc} strokeWidth={2.2} strokeLinecap="round" fill="none" />
          <Circle cx={66} cy={58} r={16} fill={soft} stroke={ink} strokeWidth={sw} />
          <Circle cx={66} cy={58} r={10} fill={glass} opacity={0.28} />
        </>
      );
      break;
    case 'mini-portable':
      art = (
        <>
          <Rect x={28} y={34} width={40} height={52} rx={10} fill={body} stroke={ink} strokeWidth={sw} />
          <Ellipse cx={48} cy={40} rx={15} ry={6} fill={soft} stroke={ink} strokeWidth={sw} />
          <Path d="M28 42c-10 2-10 18 0 20" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <Circle cx={56} cy={70} r={4} fill={acc} />
          <Path d="M36 64c2-3 4 3 7 0s4 3 7 0" stroke={glass} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.8} />
        </>
      );
      break;
    case 'stacked-tower':
      art = (
        <>
          <Body x={22} y={4} w={52} h={42} />
          <Door cx={48} cy={29} r={12} />
          <Body x={22} y={46} w={52} h={46} />
          <Door cx={48} cy={70} r={13} wave={false} />
          <Path d="M52 8c3-2 5 2 8 0" stroke={acc} strokeWidth={1.8} strokeLinecap="round" fill="none" />
        </>
      );
      break;
    case 'vented-dryer':
      art = (
        <>
          <Body x={10} y={8} w={60} h={80} />
          <Panel x={10} y={10} w={60} />
          <Door cx={40} cy={58} r={19} wave={false} />
          <Path d="M70 34c10 0 14-8 20-8" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <Path d="M78 33l-2-6M84 29l-1-6" stroke={acc} strokeWidth={1.8} strokeLinecap="round" />
        </>
      );
      break;
    case 'condenser-dryer':
      art = (
        <>
          <Body x={16} y={8} w={64} h={80} />
          <Panel x={16} y={10} w={64} />
          <Door cx={48} cy={58} r={21} wave={false} />
          <Rect x={58} y={72} width={14} height={11} rx={3} fill={glass} opacity={0.45} />
          <Path d="M65 74c-2 3-2 5 0 6 2-1 2-3 0-6z" fill={body} />
        </>
      );
      break;
    case 'heat-pump-dryer':
      art = (
        <>
          <Body x={16} y={8} w={64} h={80} />
          <Panel x={16} y={10} w={64} />
          <Door cx={48} cy={58} r={21} wave={false} />
          <Path d="M40 62c0-10 8-16 18-16 0 10-8 16-18 16z" fill={acc} opacity={0.9} />
          <Path d="M40 62l10-10" stroke={body} strokeWidth={1.8} strokeLinecap="round" />
        </>
      );
      break;
    case 'compact-dryer':
      art = (<><Body x={22} y={22} w={52} h={66} /><Panel x={22} y={24} w={52} wind /><Door cx={48} cy={64} r={15} wave={false} /></>);
      break;
    default:
      art = (<><Body x={16} y={8} w={64} h={80} /><Panel x={16} y={10} w={64} /><Door cx={48} cy={58} r={21} /></>);
  }

  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.22, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size * 0.86} height={size * 0.86} viewBox="0 0 96 96" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{art}</Svg>
    </View>
  );
}
