import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { createHeaderOffset } from '../HeaderOffset';
import { useLayoutCtx } from '../../core';
import { createBreakpointStyles } from '../../utils';
import ContentCompiler from '../../compilers/ContentCompiler';
import { useFullscreenCtx } from '../../core/Context/FullscreenContext';
import { generateStyledProxyCreator } from '../Shared/StyledProxy';

export default (styled: any) => {
  const styledProxy = generateStyledProxyCreator(styled);
  const Div = styledProxy('div');
  const Main = styledProxy('main');

  const HeaderOffset = createHeaderOffset(Div)

  const Content = ({
    children,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) => {
    const { breakpoints } = useTheme();
    const { data, state } = useLayoutCtx();
    const styles = createBreakpointStyles(
      ContentCompiler(state, data.edgeSidebar).getResultStyle(data.content.id),
      breakpoints
    );
    const isFullscreen = useFullscreenCtx();
    return (
      <Main
        {...props}
        styles={{
          transition: 'all 300ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
          ...styles,
          ...(isFullscreen && { flexGrow: 1, minHeight: 0, display: 'flex' }),
        }}
      >
        <HeaderOffset />
        {children}
      </Main>
    );
  };
  return Content;
};