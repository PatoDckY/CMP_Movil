import React, {
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
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
    search, setSearch, filters, groupedCourses, categories, modalities,
    setCategory, setModality, setMaxPrice, clearFilters, hasActiveFilters, filterError,
  } = useCatalogViewModel(
    courseRepository,
  );

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

  const hasCriteria = normalizedSearch.length > 0 || hasActiveFilters;
  const resetCatalog = () => {clearFilters(); setExpandedCategory(null);};

  const sections: CourseSection[] =
    groupedCourses.map(group => ({
      title: group.title,
      count: group.count,
      data:
        hasCriteria ||
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
          accessibilityRole="button"
          hitSlop={6}
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
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <View style={styles.heroCircle} />

              <Text style={styles.eyebrow}>CATÁLOGO ACADÉMICO</Text>

              <Text style={styles.title}>Encuentra el curso ideal para ti</Text>

              <Text style={styles.subtitle}>
                Consulta la oferta académica, compara opciones y revisa toda la
                información antes de elegir.
              </Text>

              <View style={styles.searchBox}>
                <View style={styles.searchSymbol}>
                  <Text style={styles.searchSymbolText}>⌕</Text>
                </View>

                <TextInput
                  accessibilityLabel="Buscar cursos"
                  style={styles.searchInput}
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Buscar curso..."
                  placeholderTextColor={colors.textSecondary}
                  autoCorrect={false}
                />

                {search.length > 0 && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Limpiar búsqueda"
                    hitSlop={8}
                    style={styles.clearButton}
                    onPress={() => setSearch('')}
                  >
                    <Text style={styles.clearButtonText}>×</Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{courses.length}</Text>

                  <Text style={styles.statLabel}>Cursos</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{groupedCourses.length}</Text>

                  <Text style={styles.statLabel}>Categorías</Text>
                </View>
              </View>
            </View>

            <View style={styles.filters}>
              <Text accessibilityRole="header" style={styles.filterTitle}>
                Filtrar cursos
              </Text>
              <Text style={styles.filterLabel}>Categoría</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterOptions}
              >
                {[
                  { id: null, name: 'Todas las categorías' },
                  ...categories,
                ].map(option => (
                  <Pressable
                    key={String(option.id)}
                    accessibilityRole="button"
                    accessibilityLabel={option.name}
                    accessibilityState={{
                      selected: (filters.categoryId ?? null) === option.id,
                    }}
                    onPress={() => setCategory(option.id)}
                    style={[
                      styles.filterChip,
                      (filters.categoryId ?? null) === option.id &&
                        styles.filterChipSelected,
                    ]}
                  >
                    <Text style={styles.filterChipText}>{option.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Text style={styles.filterLabel}>Modalidad</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterOptions}
              >
                {[
                  { id: null, name: 'Todas las modalidades' },
                  ...modalities,
                ].map(option => (
                  <Pressable
                    key={String(option.id)}
                    accessibilityRole="button"
                    accessibilityLabel={option.name}
                    accessibilityState={{
                      selected: (filters.modalityId ?? null) === option.id,
                    }}
                    onPress={() => setModality(option.id)}
                    style={[
                      styles.filterChip,
                      (filters.modalityId ?? null) === option.id &&
                        styles.filterChipSelected,
                    ]}
                  >
                    <Text style={styles.filterChipText}>{option.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Text style={styles.filterLabel}>Precio máximo (MXN)</Text>
              <TextInput
                accessibilityLabel="Precio máximo en pesos mexicanos"
                keyboardType="decimal-pad"
                value={filters.maxPrice ?? ''}
                onChangeText={setMaxPrice}
                placeholder="Sin límite de precio"
                placeholderTextColor={colors.textSecondary}
                style={styles.priceFilter}
              />
              {filterError ? (
                <Text accessibilityRole="alert" style={styles.filterError}>
                  {filterError}
                </Text>
              ) : null}
              {hasCriteria ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Limpiar búsqueda y filtros"
                  onPress={resetCatalog}
                  style={styles.resetFilters}
                >
                  <Text style={styles.filterChipText}>
                    Limpiar búsqueda y filtros
                  </Text>
                </Pressable>
              ) : null}
            </View>

            <View style={styles.catalogIntro}>
              <Text style={styles.catalogIntroTitle}>
                Explora por categoría
              </Text>

              <Text style={styles.catalogIntroText}>
                Toca una categoría para consultar sus cursos.
              </Text>
            </View>

            {normalizedSearch.length > 0 && (
              <View style={styles.searchResultInfo}>
                <Text style={styles.searchResultText}>Resultados para</Text>

                <Text style={styles.searchResultValue}>“{search.trim()}”</Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          hasCriteria ? (
            <View style={styles.emptySearch}>
              <View style={styles.emptySearchIcon}>
                <Text style={styles.emptySearchIconText}>?</Text>
              </View>

              <Text style={styles.emptySearchTitle}>Sin resultados</Text>

              <Text style={styles.emptySearchText}>
                No encontramos cursos con los criterios seleccionados.
              </Text>

              <Pressable accessibilityRole="button" hitSlop={12} onPress={() => resetCatalog()}>
                <Text style={styles.clearSearchLink}>
                  Limpiar búsqueda y filtros
                </Text>
              </Pressable>
            </View>
          ) : undefined
        }
        renderSectionHeader={({ section }) => {
          const expanded = hasCriteria || expandedCategory === section.title;

          return (
            <CategoryCard
              title={section.title}
              count={section.count}
              expanded={expanded}
              disabled={hasCriteria}
              onPress={() => toggleCategory(section.title)}
            />
          );
        }}
        renderItem={({ item }) => (
          <CourseCard course={item} onPress={() => openCourse(item.id)} />
        )}
      />
    </View>
  );
}
