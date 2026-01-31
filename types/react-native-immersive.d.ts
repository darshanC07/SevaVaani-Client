declare module 'react-native-immersive' {
  export interface ImmersiveStatic {
    on(): void;
    off(): void;
    addListener(listener: (isImmersive: boolean) => void): void;
    removeListener(listener: (isImmersive: boolean) => void): void;
  }

  const Immersive: ImmersiveStatic;
  export default Immersive;
}
