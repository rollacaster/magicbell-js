import MagicBell from '@magicbell/magicbell-react';
import { IMagicBellTheme } from '@magicbell/magicbell-react/dist/types/context/Theme';
import { h } from 'preact';
import FloatingFrame from '../FloatingFrame';
import { FrameContentProps } from '../FrameContent';

export interface WidgetProps extends FrameContentProps {
  apiKey: string;
  userEmail: string;
  userKey?: string;
  theme: Partial<IMagicBellTheme>;
}

/**
 * Component to render MagicBell within an iframe.
 *
 * @example
 * <Widget
 *   apiKey="API_KEY"
 *   userEmail="USER_EMAIL"
 *   onAllRead={notify}
 *   onNotificationClick={navigate} />
 */
export default function Widget({ apiKey, userEmail, userKey, theme, ...inboxProps }: WidgetProps) {
  return (
    <MagicBell apiKey={apiKey} userEmail={userEmail} userKey={userKey} theme={theme}>
      {(props) => <FloatingFrame {...inboxProps} {...props} />}
    </MagicBell>
  );
}