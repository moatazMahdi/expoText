import {
  NavigationContainerRef,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import {Linking} from 'react-native';

interface Route {
  name: string;
  params?: object;
}

export const getRoutes = (...args: Route[]) => {
  const reverseArgs = args?.slice(0)?.reverse();
  let route: any = {};
  reverseArgs?.forEach((arg, index, array) => {
    if (index === array.length - 1) {
      route = {
        name: arg.name,
        params: {
          ...(arg.params || {}),
          ...route,
        },
      };
    } else {
      route = {
        screen: arg.name,
        params: {
          ...(arg.params || {}),
          ...route,
        },
      };
    }
  });
  return route;
};

export const useNavigationUtils = () => {
  const navigation = useNavigation();
  return {
    ...navigation,
    navigateToScreen: navigation.navigate,
    resetTo: (...args: Route[]) =>
      navigation.reset({
        index: 0,
        routes: [getRoutes(...args) as any],
      }),
    navigateTo: (...args: Route[]) => {
      const route = getRoutes(...args);
      navigation.navigate(route.name, route.params);
    },
    replace: (...args: Route[]) => {
      const route = getRoutes(...args);
      // navigation.navigate(route.name, route.params);
      navigation.dispatch(StackActions.replace(route.name, route.params));
    },
  };
};

export const useRootNavigationUtils = (
  rootNavigator: React.MutableRefObject<NavigationContainerRef | null>,
) => ({
  ...rootNavigator.current,
  navigateToScreen: rootNavigator.current?.navigate,
  resetTo: (...args: Route[]) =>
    rootNavigator.current?.reset({
      index: 0,
      routes: [getRoutes(...args) as any],
    }),
  navigateTo: (...args: Route[]) => {
    if (args.length > 1) {
      if (args[1].name?.includes('secret::')) {
        Linking.openURL(
          args[1].name.split('secret::')[1].split('_')?.join('/'),
        );
        const route = getRoutes(args[0]);
        rootNavigator.current?.navigate(route.name, route.params);
      } else {
        const route = getRoutes(...args);
        rootNavigator.current?.navigate(route.name, route.params);
      }
    }
    const route = getRoutes(...args);
    rootNavigator.current?.navigate(route.name, route.params);
  },
  replace: (...args: Route[]) => {
    const route = getRoutes(...args);
    rootNavigator.current?.dispatch(
      StackActions.replace(route.name, route.params),
    );
  },
});
