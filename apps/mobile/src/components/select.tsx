import { Feather } from '@expo/vector-icons';
import { OTHER, radius, space } from '@naqa/shared';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useApp } from '../lib/app-context';
import { Field, Row, Text } from './ui';

export interface SelectItem { id: string; label: string; swatch?: string[] }
export interface SelectGroup { title?: string; items: SelectItem[] }

/**
 * Dropdown: a field that opens a bottom sheet of grouped choices, with search for long lists and an
 * optional "Other" that reveals a text box so people can type what is not listed.
 */
export function Select({
  placeholder, groups, value, onChange, otherLabel, otherPlaceholder, otherValue, onOtherChange, searchPlaceholder, accessibilityLabel, extraBottom,
}: {
  placeholder: string;
  groups: SelectGroup[];
  value?: string;
  onChange: (id: string) => void;
  otherLabel?: string;
  otherPlaceholder?: string;
  otherValue?: string;
  onOtherChange?: (text: string) => void;
  searchPlaceholder?: string;
  accessibilityLabel?: string;
  /** Extra rows shown after the groups, before "Other" (for example "I do not know"). */
  extraBottom?: SelectItem[];
}) {
  const { t, colors, rtl } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const all = useMemo(() => [...groups.flatMap((g) => g.items), ...(extraBottom ?? [])], [groups, extraBottom]);
  const selected = value === OTHER ? { id: OTHER, label: otherLabel ?? '' } : all.find((i) => i.id === value);
  const searchable = all.length > 12;
  const q = query.trim().toLowerCase();
  const filtered = q ? groups.map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) })).filter((g) => g.items.length > 0) : groups;
  const extras = q ? (extraBottom ?? []).filter((i) => i.label.toLowerCase().includes(q)) : extraBottom ?? [];

  const pick = (id: string) => { onChange(id); setOpen(false); setQuery(''); };

  const Row_ = (i: SelectItem) => {
    const on = i.id === value;
    return (
      <Pressable key={i.id} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => pick(i.id)}
        style={({ pressed }) => ({ minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.sm, borderRadius: radius.md, backgroundColor: on ? colors.primarySoft : pressed ? colors.surfaceMuted : 'transparent' })}>
        {i.swatch ? <Swatch colors={i.swatch} /> : null}
        <Text style={{ flex: 1 }} weight={on ? 'semibold' : 'regular'}>{i.label}</Text>
        {on ? <Feather name="check" size={18} color={colors.primary} /> : null}
      </Pressable>
    );
  };

  return (
    <View style={{ gap: space.sm }}>
      <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? placeholder} onPress={() => setOpen(true)}
        style={{ minHeight: 56, borderRadius: radius.md, borderWidth: 1, borderColor: value ? colors.primary : colors.line, backgroundColor: colors.surface, paddingHorizontal: space.lg, flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        {selected && 'swatch' in selected && selected.swatch ? <Swatch colors={selected.swatch} /> : null}
        <Text style={{ flex: 1 }} muted={!selected} weight={selected ? 'semibold' : 'regular'}>{selected ? (value === OTHER ? otherLabel ?? '' : selected.label) : placeholder}</Text>
        <Feather name="chevron-down" size={20} color={colors.inkMuted} />
      </Pressable>

      {value === OTHER && onOtherChange ? (
        <Field icon="edit-3" value={otherValue ?? ''} onChangeText={onOtherChange} placeholder={otherPlaceholder} accessibilityLabel={otherPlaceholder} autoFocus />
      ) : null}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable accessibilityLabel={t.manual.close} onPress={() => setOpen(false)} style={{ flex: 1, backgroundColor: 'rgba(8,14,40,0.5)', justifyContent: 'flex-end' }}>
          <Pressable style={{ maxHeight: '82%', backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingTop: space.lg, direction: rtl ? 'rtl' : 'ltr' }}>
            <Row style={{ paddingHorizontal: space.xl, paddingBottom: space.md }}>
              <Text variant="title" weight="semibold" style={{ flex: 1 }}>{placeholder}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={t.manual.close} hitSlop={10} onPress={() => setOpen(false)}>
                <Feather name="x" size={22} color={colors.inkMuted} />
              </Pressable>
            </Row>
            {searchable ? (
              <View style={{ paddingHorizontal: space.xl, paddingBottom: space.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 48, borderRadius: radius.md, backgroundColor: colors.surfaceMuted, paddingHorizontal: space.md }}>
                  <Feather name="search" size={18} color={colors.inkMuted} />
                  <TextInput value={query} onChangeText={setQuery} placeholder={searchPlaceholder} placeholderTextColor={colors.inkMuted} autoCorrect={false}
                    style={{ flex: 1, minHeight: 44, color: colors.ink, textAlign: 'auto', writingDirection: rtl ? 'rtl' : 'ltr' }} />
                </View>
              </View>
            ) : null}
            <ScrollView contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: 2 }} keyboardShouldPersistTaps="handled">
              {filtered.map((g, gi) => (
                <View key={gi} style={{ gap: 2 }}>
                  {g.title ? <Text variant="caption" weight="semibold" muted style={{ paddingHorizontal: space.sm, paddingTop: space.md, paddingBottom: space.xs }}>{g.title}</Text> : null}
                  {g.items.map(Row_)}
                </View>
              ))}
              {extras.length > 0 ? <View style={{ paddingTop: space.sm }}>{extras.map(Row_)}</View> : null}
              {filtered.length === 0 && extras.length === 0 ? <Text muted style={{ padding: space.lg }}>{t.manual.noResults}</Text> : null}
              {otherLabel ? (
                <View style={{ paddingTop: space.sm }}>
                  {Row_({ id: OTHER, label: otherLabel })}
                </View>
              ) : null}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export function Swatch({ colors: cs, size = 22 }: { colors: string[]; size?: number }) {
  const { colors } = useApp();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', flexDirection: 'row', borderWidth: 1, borderColor: colors.line }}>
      {cs.map((c) => <View key={c} style={{ flex: 1, backgroundColor: c }} />)}
    </View>
  );
}
