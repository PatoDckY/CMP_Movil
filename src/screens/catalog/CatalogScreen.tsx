import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {CategoryCard} from '../../components/catalog/CategoryCard';
import {CourseCard} from '../../components/catalog/CourseCard';
import {courseRepository} from '../../config/dependencies';
import {Course} from '../../models/Course';
import {CourseFlowParamList} from '../../navigation/types';
import {colors} from '../../theme/colors';
import {useCatalogViewModel} from '../../viewmodels/catalog/useCatalogViewModel';
import {styles} from './CatalogScreen.styles';

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
  } = useCatalogViewModel(
    courseRepository,
  );

  const [search, setSearch] =
    useState('');

  const [
    expandedCategory,
    setExpandedCategory,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const normalizedSearch =
    search
      .trim()
      .toLocaleLowerCase('es-MX');

  const groupedCourses =
    useMemo<CourseGroup[]>(() => {
      const groups =
        new Map<string, Course[]>();

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
          .toLocaleLowerCase(
            'es-MX',
          );

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
        normalizedSearch.length >
          0 ||
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
                style={styles.stats}>
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
            <CategoryCard
              title={section.title}
              count={section.count}
              expanded={expanded}
              disabled={
                normalizedSearch.length >
                0
              }
              onPress={() =>
                toggleCategory(
                  section.title,
                )
              }
            />
          );
        }}
        renderItem={({item}) => (
          <CourseCard
            course={item}
            onPress={() =>
              openCourse(item.id)
            }
          />
        )}
      />
    </View>
  );
}