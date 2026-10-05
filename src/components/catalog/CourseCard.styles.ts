import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 17,
    marginHorizontal: 26,
    marginBottom: 11,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },

  modalityBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  modalityText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '800',
  },

  price: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },

  title: {
    color: colors.primary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
  },

  description: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },

  details: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 15,
    paddingTop: 13,
  },

  detailColumn: {
    flex: 1,
    marginRight: 10,
  },

  detailLabel: {
    color: colors.textSecondary,
    fontSize: 8,
    fontWeight: '800',
  },

  detailValue: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },

  capacityRow: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 13,
  },

  capacityText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '800',
  },

  action: {
    minHeight: 44,
    backgroundColor: colors.accent,
    borderRadius: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 14,
  },

  actionText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },

  actionArrow: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '800',
  },

  pressed: {
    opacity: 0.75,
  },
});