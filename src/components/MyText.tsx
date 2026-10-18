import { Text, TextProps } from 'react-native';

export function MyText(props: TextProps) {
  return <Text {...props} className={`font-sans ${props.className ?? ''}`} />;
}