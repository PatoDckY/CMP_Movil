import {StyleSheet} from 'react-native';

import {colors} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: 17,
    padding: 15,
    marginTop: 14,
  },

  dashboardContainer: {
    marginTop: 5,
  },

  icon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  dashboardIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
  },

  iconText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
  },

  dashboardIconText: {
    fontSize: 14,
  },

  content: {
    flex: 1,
  },

  title: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
  },

  dashboardTitle: {
    fontSize: 12,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 9,
    lineHeight: 15,
    marginTop: 4,
  },

  dashboardDescription: {
    fontSize: 10,
    lineHeight: 16,
  },
});