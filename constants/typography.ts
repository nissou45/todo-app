import { useFonts,
  Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold
} from '@expo-google-fonts/poppins';
import {
  DMSans_400Regular, DMSans_500Medium, DMSans_700Bold
} from '@expo-google-fonts/dm-sans';

export const FONTS = {
  display: 'Poppins_500Medium',
  displayBold: 'Poppins_700Bold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemi: 'DMSans_700Bold',
  bodyBold: 'DMSans_700Bold',
};

export function useAppFonts() {
  return useFonts({
    Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold,
    DMSans_400Regular, DMSans_500Medium, DMSans_700Bold,
  });
}
