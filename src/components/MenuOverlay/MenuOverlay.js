import actions from 'actions';
import DataElementWrapper from 'components/DataElementWrapper';
import Icon from 'components/Icon';
import ActionButton from 'components/ActionButton';
import { workerTypes } from 'constants/types';
import core from 'core';
import { isIOS, isIE } from 'helpers/device';
import openFilePicker from 'helpers/openFilePicker';
import toggleFullscreen from 'helpers/toggleFullscreen';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import FlyoutMenu from '../FlyoutMenu/FlyoutMenu';
import './MenuOverlay.scss';

function MenuOverlay() {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const [documentType, setDocumentType] = useState(null);

  const activeTheme = useSelector(selectors.getActiveTheme);
  const isEmbedPrintSupported = useSelector(selectors.isEmbedPrintSupported);
  const colorMap = useSelector(selectors.getColorMap);
  const sortStrategy = useSelector(selectors.getSortStrategy);
  const isFullScreen = useSelector(selectors.isFullScreen);

  const closeMenuOverlay = useCallback(() => dispatch(actions.closeElements(['menuOverlay'])), [dispatch]);
  const setActiveLightTheme = useCallback(() => dispatch(actions.setActiveTheme('light')), [dispatch]);
  const setActiveDarkTheme = useCallback(() => dispatch(actions.setActiveTheme('dark')), [dispatch]);

  useEffect(() => {
    const onDocumentLoaded = () => setDocumentType(core.getDocument().getType());
    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => {
      core.removeEventListener('documentLoaded', onDocumentLoaded);
    };
  }, []);

  return (
    <FlyoutMenu menu="menuOverlay" trigger="menuButton" onClose={undefined} ariaLabel={t('component.menuOverlay')}>
      <ActionButton
        dataElement="filePickerButton"
        className="row"
        img="icon-header-file-picker-line"
        label={t('action.openFile')}
        ariaLabel={t('action.openFile')}
        role="option"
        onClick={openFilePicker}
      />
      <ActionButton
        dataElement="fullscreenButton"
        className="row"
        img={isFullScreen ? 'icon-header-full-screen-exit' : 'icon-header-full-screen'}
        label={isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen')}
        ariaLabel={isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen')}
        role="option"
        onClick={toggleFullscreen}
      />
      {!isIE && (
        <ActionButton
          dataElement="themeChangeButton"
          className="row"
          img={`icon - header - mode - ${activeTheme === 'dark' ? 'day' : 'night'}`}
          label={activeTheme === 'dark' ? t('action.lightMode') : t('action.darkMode')}
          ariaLabel={activeTheme === 'dark' ? t('action.lightMode') : t('action.darkMode')}
          role="option"
          onClick={activeTheme === 'dark' ? setActiveLightTheme : setActiveDarkTheme}
        />
      )}
    </FlyoutMenu>
  );
}

export default MenuOverlay;
