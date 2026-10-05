import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {courseRepository} from '../../config/dependencies';
import {Course} from '../../models/Course';
import {CourseFlowParamList} from '../../navigation/types';
import {colors} from '../../theme/colors';
import {useCatalogViewModel} from '../../viewmodels/catalog/useCatalogViewModel';

type CatalogNavigation =
  NativeStackNavigationProp<
    CourseFlowParamList,
    'Catalog'
  >;

type CourseGroup = {
  title: string;
  count: number;
  courses: Course[];
};

type CourseSection = {
  title: string;
  count: number;
  data: Course[];
};

export function CatalogScreen(): React.JSX.Element {
  const navigation =
    useNavigation<CatalogNavigation>();

  const {
    courses,
    state,
    error,
    loadCourses,
  } = useCatalogViewModel(courseRepository);

  const [search, setSearch] =
    useState('');

  const [
    expandedCategory,
    setExpandedCategory,
  ] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const normalizedSearch =
    search
      .trim()
      .toLocaleLowerCase('es-MX');

  const groupedCourses =
    useMemo<CourseGroup[]>(() => {
      const groups = new Map<
        string,
        Course[]
      >();

      courses.forEach(course => {
        const category =
          course.categoryName?.trim() ||
          'Sin categoría';

        const searchableText = [
          course.title,
          course.description,
          course.instructorName,
          course.modalityName,
          category,
        ]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase('es-MX');

        if (
          normalizedSearch &&
          !searchableText.includes(
            normalizedSearch,
          )
        ) {
          return;
        }

        const current =
          groups.get(category) ?? [];

        current.push(course);

        groups.set(
          category,
          current,
        );
      });

      return Array.from(
        groups.entries(),
      )
        .sort(([a], [b]) =>
          a.localeCompare(
            b,
            'es',
          ),
        )
        .map(
          ([
            title,
            categoryCourses,
          ]) => ({
            title,
            count:
              categoryCourses.length,
            courses: [
              ...categoryCourses,
            ].sort((a, b) =>
              a.title.localeCompare(
                b.title,
                'es',
              ),
            ),
          }),
        );
    }, [
      courses,
      normalizedSearch,
    ]);

  const sections: CourseSection[] =
    groupedCourses.map(group => ({
      title: group.title,
      count: group.count,
      data:
        normalizedSearch.length > 0 ||
        expandedCategory ===
          group.title
          ? group.courses
          : [],
    }));

  const toggleCategory = (
    category: string,
  ) => {
    setExpandedCategory(current =>
      current === category
        ? null
        : category,
    );
  };

  const openCourse = (
    courseId: number,
  ) => {
    navigation.navigate(
      'CourseDetail',
      {
        courseId,
      },
    );
  };

  if (
    state === 'idle' ||
    state === 'loading'
  ) {
    return (
      <View style={styles.center}>
        <View
          style={
            styles.loadingContainer
          }>
          <ActivityIndicator
            size="large"
            color={colors.accent}
          />
        </View>

        <Text
          style={
            styles.loadingTitle
          }>
          Cargando catálogo
        </Text>

        <Text
          style={
            styles.centerMessage
          }>
          Preparando los cursos
          disponibles.
        </Text>
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View style={styles.center}>
        <Text
          style={
            styles.errorTitle
          }>
          No pudimos cargar los cursos
        </Text>

        <Text
          style={
            styles.centerMessage
          }>
          {error}
        </Text>

        <Pressable
          style={({pressed}) => [
            styles.retryButton,
            pressed &&
              styles.pressed,
          ]}
          onPress={loadCourses}>
          <Text
            style={
              styles.retryButtonText
            }>
            Intentar nuevamente
          </Text>
        </Pressable>
      </View>
    );
  }

  if (state === 'empty') {
    return (
      <View style={styles.center}>
        <Text
          style={
            styles.errorTitle
          }>
          No hay cursos disponibles
        </Text>

        <Text
          style={
            styles.centerMessage
          }>
          Cuando existan nuevos cursos
          aparecerán aquí.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SectionList
        sections={sections}
        keyExtractor={item =>
          String(item.id)
        }
        showsVerticalScrollIndicator={
          false
        }
        stickySectionHeadersEnabled={
          false
        }
        contentContainerStyle={
          styles.list
        }
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <View
                style={
                  styles.heroCircle
                }
              />

              <Text
                style={
                  styles.eyebrow
                }>
                CATÁLOGO ACADÉMICO
              </Text>

              <Text
                style={
                  styles.title
                }>
                Encuentra el curso ideal
                para ti
              </Text>

              <Text
                style={
                  styles.subtitle
                }>
                Consulta la oferta
                académica, compara
                opciones y revisa toda la
                información antes de
                elegir.
              </Text>

              <View
                style={
                  styles.searchBox
                }>
                <View
                  style={
                    styles.searchSymbol
                  }>
                  <Text
                    style={
                      styles.searchSymbolText
                    }>
                    ⌕
                  </Text>
                </View>

                <TextInput
                  style={
                    styles.searchInput
                  }
                  value={search}
                  onChangeText={
                    setSearch
                  }
                  placeholder="Buscar curso..."
                  placeholderTextColor={
                    colors.textSecondary
                  }
                  autoCorrect={false}
                />

                {search.length >
                  0 && (
                  <Pressable
                    style={
                      styles.clearButton
                    }
                    onPress={() =>
                      setSearch('')
                    }>
                    <Text
                      style={
                        styles.clearButtonText
                      }>
                      ×
                    </Text>
                  </Pressable>
                )}
              </View>

              <View
                style={
                  styles.stats
                }>
                <View
                  style={
                    styles.statItem
                  }>
                  <Text
                    style={
                      styles.statNumber
                    }>
                    {courses.length}
                  </Text>

                  <Text
                    style={
                      styles.statLabel
                    }>
                    Cursos
                  </Text>
                </View>

                <View
                  style={
                    styles.statDivider
                  }
                />

                <View
                  style={
                    styles.statItem
                  }>
                  <Text
                    style={
                      styles.statNumber
                    }>
                    {
                      groupedCourses.length
                    }
                  </Text>

                  <Text
                    style={
                      styles.statLabel
                    }>
                    Categorías
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={
                styles.catalogIntro
              }>
              <Text
                style={
                  styles.catalogIntroTitle
                }>
                Explora por categoría
              </Text>

              <Text
                style={
                  styles.catalogIntroText
                }>
                Toca una categoría para
                consultar sus cursos.
              </Text>
            </View>

            {normalizedSearch.length >
              0 && (
              <View
                style={
                  styles.searchResultInfo
                }>
                <Text
                  style={
                    styles.searchResultText
                  }>
                  Resultados para
                </Text>

                <Text
                  style={
                    styles.searchResultValue
                  }>
                  “{search.trim()}”
                </Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          normalizedSearch.length >
          0 ? (
            <View
              style={
                styles.emptySearch
              }>
              <View
                style={
                  styles.emptySearchIcon
                }>
                <Text
                  style={
                    styles.emptySearchIconText
                  }>
                  ?
                </Text>
              </View>

              <Text
                style={
                  styles.emptySearchTitle
                }>
                Sin resultados
              </Text>

              <Text
                style={
                  styles.emptySearchText
                }>
                No encontramos cursos
                relacionados con
                “{search.trim()}”.
              </Text>

              <Pressable
                onPress={() =>
                  setSearch('')
                }>
                <Text
                  style={
                    styles.clearSearchLink
                  }>
                  Limpiar búsqueda
                </Text>
              </Pressable>
            </View>
          ) : undefined
        }
        renderSectionHeader={({
          section,
        }) => {
          const expanded =
            normalizedSearch.length >
              0 ||
            expandedCategory ===
              section.title;

          return (
            <Pressable
              disabled={
                normalizedSearch.length >
                0
              }
              style={({pressed}) => [
                styles.categoryCard,
                expanded &&
                  styles.categoryCardExpanded,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                toggleCategory(
                  section.title,
                )
              }>
              <View
                style={
                  styles.categoryStripe
                }
              />

              <View
                style={
                  styles.categoryContent
                }>
                <Text
                  style={[
                    styles.categoryName,
                    expanded &&
                      styles.categoryNameExpanded,
                  ]}>
                  {section.title}
                </Text>

                <Text
                  style={[
                    styles.categoryCount,
                    expanded &&
                      styles.categoryCountExpanded,
                  ]}>
                  {section.count}{' '}
                  {section.count ===
                  1
                    ? 'curso disponible'
                    : 'cursos disponibles'}
                </Text>
              </View>

              {!normalizedSearch && (
                <View
                  style={[
                    styles.categoryButton,
                    expanded &&
                      styles.categoryButtonExpanded,
                  ]}>
                  <Text
                    style={
                      styles.categoryButtonText
                    }>
                    {expanded
                      ? '−'
                      : '+'}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        }}
        renderItem={({item}) => {
          const occupied =
            item.occupiedCapacity ??
            0;

          const available =
            Math.max(
              item.maxCapacity -
                occupied,
              0,
            );

          return (
            <Pressable
              style={({pressed}) => [
                styles.courseCard,
                pressed &&
                  styles.pressed,
              ]}
              onPress={() =>
                openCourse(item.id)
              }>
              <View
                style={
                  styles.cardHeader
                }>
                <View
                  style={
                    styles.modalityBadge
                  }>
                  <Text
                    style={
                      styles.modalityText
                    }>
                    {item.modalityName ??
                      'Curso'}
                  </Text>
                </View>

                <Text
                  style={
                    styles.price
                  }>
                  {getPrice(
                    item.cost,
                  )}
                </Text>
              </View>

              <Text
                style={
                  styles.courseTitle
                }>
                {item.title}
              </Text>

              <Text
                style={
                  styles.description
                }
                numberOfLines={2}>
                {item.description ??
                  'Consulta la información completa de este curso.'}
              </Text>

              <View
                style={
                  styles.details
                }>
                <View
                  style={
                    styles.detailColumn
                  }>
                  <Text
                    style={
                      styles.detailLabel
                    }>
                    INSTRUCTOR
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }
                    numberOfLines={
                      1
                    }>
                    {item.instructorName ??
                      'Por confirmar'}
                  </Text>
                </View>

                <View
                  style={
                    styles.detailColumn
                  }>
                  <Text
                    style={
                      styles.detailLabel
                    }>
                    INICIO
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }>
                    {formatDate(
                      item.startDate,
                    )}
                  </Text>
                </View>
              </View>

              <View
                style={
                  styles.capacityRow
                }>
                <Text
                  style={
                    styles.capacityText
                  }>
                  {available >
                  0
                    ? `${available} lugares disponibles`
                    : 'Sin lugares disponibles'}
                </Text>
              </View>

              <View
                style={
                  styles.courseAction
                }>
                <Text
                  style={
                    styles.courseActionText
                  }>
                  Ver información
                </Text>

                <Text
                  style={
                    styles.courseActionArrow
                  }>
                  →
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

function getPrice(
  cost: string | null,
): string {
  if (!cost) {
    return 'Sin costo';
  }

  const value = Number(cost);

  if (
    Number.isFinite(value) &&
    value <= 0
  ) {
    return 'Sin costo';
  }

  if (
    !Number.isFinite(value)
  ) {
    return `$${cost}`;
  }

  return value.toLocaleString(
    'es-MX',
    {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  );
}

function formatDate(
  value: string,
): string {
  const datePart =
    value.split('T')[0];

  const parts =
    datePart.split('-');

  if (
    parts.length !== 3
  ) {
    return value;
  }

  const day =
    Number(parts[2]);

  const month =
    Number(parts[1]);

  const year =
    Number(parts[0]);

  const date = new Date(
    year,
    month - 1,
    day,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    'es-MX',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    list: {
      paddingBottom: 40,
    },

    hero: {
      backgroundColor:
        colors.primary,
      paddingHorizontal: 20,
      paddingTop: 25,
      paddingBottom: 22,
      overflow: 'hidden',
    },

    heroCircle: {
      position: 'absolute',
      width: 170,
      height: 170,
      borderRadius: 85,
      backgroundColor:
        colors.primaryLight,
      right: -65,
      top: -70,
    },

    eyebrow: {
      color: colors.accent,
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 1.3,
    },

    title: {
      color: colors.surface,
      fontSize: 27,
      lineHeight: 34,
      fontWeight: '900',
      marginTop: 7,
      maxWidth: '90%',
    },

    subtitle: {
      color: colors.primarySoft,
      fontSize: 13,
      lineHeight: 20,
      marginTop: 8,
      maxWidth: '94%',
    },

    searchBox: {
      minHeight: 52,
      backgroundColor:
        colors.surface,
      borderRadius: 15,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      marginTop: 20,
    },

    searchSymbol: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor:
        colors.primarySoft,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    searchSymbolText: {
      color: colors.primary,
      fontSize: 19,
      fontWeight: '800',
    },

    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 14,
      paddingHorizontal: 10,
    },

    clearButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    clearButtonText: {
      color:
        colors.textSecondary,
      fontSize: 22,
    },

    stats: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 17,
    },

    statItem: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },

    statNumber: {
      color: colors.accent,
      fontSize: 18,
      fontWeight: '900',
    },

    statLabel: {
      color:
        colors.primarySoft,
      fontSize: 10,
      marginLeft: 5,
    },

    statDivider: {
      width: 1,
      height: 19,
      backgroundColor:
        colors.primaryLight,
      marginHorizontal: 16,
    },

    catalogIntro: {
      paddingHorizontal: 20,
      paddingTop: 23,
      paddingBottom: 15,
    },

    catalogIntroTitle: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: '900',
    },

    catalogIntroText: {
      color:
        colors.textSecondary,
      fontSize: 12,
      marginTop: 4,
    },

    searchResultInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 20,
      paddingBottom: 12,
    },

    searchResultText: {
      color:
        colors.textSecondary,
      fontSize: 12,
      marginRight: 4,
    },

    searchResultValue: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '800',
    },

    categoryCard: {
      minHeight: 72,
      backgroundColor:
        colors.surface,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 18,
      marginHorizontal: 20,
      marginBottom: 11,
      overflow: 'hidden',
      flexDirection: 'row',
      alignItems: 'center',
    },

    categoryCardExpanded: {
      backgroundColor:
        colors.primary,
      borderColor:
        colors.primary,
    },

    categoryStripe: {
      width: 5,
      alignSelf: 'stretch',
      backgroundColor:
        colors.accent,
    },

    categoryContent: {
      flex: 1,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },

    categoryName: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '900',
    },

    categoryNameExpanded: {
      color: colors.surface,
    },

    categoryCount: {
      color:
        colors.textSecondary,
      fontSize: 10,
      fontWeight: '600',
      marginTop: 4,
    },

    categoryCountExpanded: {
      color:
        colors.primarySoft,
    },

    categoryButton: {
      width: 35,
      height: 35,
      borderRadius: 11,
      backgroundColor:
        colors.primarySoft,
      alignItems: 'center',
      justifyContent:
        'center',
      marginRight: 14,
    },

    categoryButtonExpanded: {
      backgroundColor:
        colors.accent,
    },

    categoryButtonText: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: '700',
    },

    courseCard: {
      backgroundColor:
        colors.surface,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 18,
      padding: 17,
      marginHorizontal: 26,
      marginBottom: 11,
    },

    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 11,
    },

    modalityBadge: {
      backgroundColor:
        colors.primarySoft,
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

    courseTitle: {
      color: colors.primary,
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '900',
    },

    description: {
      color:
        colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      marginTop: 7,
    },

    details: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor:
        colors.border,
      marginTop: 15,
      paddingTop: 13,
    },

    detailColumn: {
      flex: 1,
      marginRight: 10,
    },

    detailLabel: {
      color:
        colors.textSecondary,
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
      alignSelf:
        'flex-start',
      backgroundColor:
        colors.accentSoft,
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

    courseAction: {
      minHeight: 44,
      backgroundColor:
        colors.accent,
      borderRadius: 11,
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      paddingHorizontal: 14,
      marginTop: 14,
    },

    courseActionText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '900',
    },

    courseActionArrow: {
      color: colors.primary,
      fontSize: 19,
      fontWeight: '800',
    },

    emptySearch: {
      backgroundColor:
        colors.surface,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 20,
      marginHorizontal: 20,
      padding: 26,
      alignItems: 'center',
    },

    emptySearchIcon: {
      width: 48,
      height: 48,
      borderRadius: 15,
      backgroundColor:
        colors.primarySoft,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    emptySearchIconText: {
      color: colors.primary,
      fontSize: 19,
      fontWeight: '900',
    },

    emptySearchTitle: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: '900',
      marginTop: 13,
    },

    emptySearchText: {
      color:
        colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      textAlign: 'center',
      marginTop: 6,
    },

    clearSearchLink: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '900',
      marginTop: 14,
    },

    center: {
      flex: 1,
      backgroundColor:
        colors.background,
      alignItems: 'center',
      justifyContent:
        'center',
      padding: 28,
    },

    loadingContainer: {
      width: 70,
      height: 70,
      borderRadius: 22,
      backgroundColor:
        colors.primary,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    loadingTitle: {
      color: colors.primary,
      fontSize: 19,
      fontWeight: '900',
      marginTop: 17,
    },

    centerMessage: {
      color:
        colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      textAlign: 'center',
      marginTop: 7,
    },

    errorTitle: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: '900',
      textAlign: 'center',
    },

    retryButton: {
      backgroundColor:
        colors.primary,
      borderRadius: 11,
      paddingHorizontal: 18,
      paddingVertical: 12,
      marginTop: 18,
    },

    retryButtonText: {
      color: colors.surface,
      fontSize: 12,
      fontWeight: '800',
    },

    pressed: {
      opacity: 0.75,
    },
  });