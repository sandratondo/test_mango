import React from 'react';
import Range from '../../components/Range/Range';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';



describe('componente rango', () => {
    it('renderizar con props de rango normal', () => {
        const props = {
            min: 1.0,
            max: 500.0,
            values: [25.0, 75.0] as [number, number], 
            onValuesChange: jest.fn(),
        };

        render(<Range {...props} />);

        expect(screen.getByRole('slider', { name: 'min' })).toBeInTheDocument();
        expect(screen.getByRole('slider', { name: 'max' })).toBeInTheDocument();
        expect(screen.getByText('25.00€')).toBeInTheDocument();
        expect(screen.getByText('75.00€')).toBeInTheDocument();
    });

    it('actualizar los valores cuando se arrastra el control', () => {
      const onValuesChangeMock = jest.fn();
      const props = {
          min: 1,
          max: 500,
          values: [25, 75] as [number, number],
          onValuesChange: onValuesChangeMock,
      };

      render(<Range {...props} />);

      const handleMin = screen.getByTestId('handle-min');
      const handleMax = screen.getByTestId('handle-max');

      // Activar manualmente handlePointerDown y simular un arrastre
      fireEvent.mouseDown(handleMin); // Usar mouseDown
      
      // Simular el calculo que se hace en handlePointerMove
      const rangeRect = handleMin.parentElement!.getBoundingClientRect();
      const rangeWidth = rangeRect.width;
      const handleWidth = handleMin.offsetWidth || 0;
      const clientX = rangeRect.left + 100 + handleWidth/2
      let mousePosInTrack = clientX - rangeRect.left - handleWidth / 2;
      let newPosition = (mousePosInTrack / rangeWidth) * 100;
      newPosition = Math.max(0, Math.min(newPosition, 100));
      const rangeDiff = props.max - props.min;
      let newValue = props.min + (newPosition / 100) * rangeDiff;
      fireEvent.mouseMove(document.body, { clientX: clientX }); // Usar mouseMove
      fireEvent.mouseUp(document.body); // Usar mouseUp

      expect(onValuesChangeMock).toHaveBeenCalled();

      fireEvent.mouseDown(handleMax); // Usar mouseDown
      const rangeRectMax = handleMax.parentElement!.getBoundingClientRect();
      const rangeWidthMax = rangeRectMax.width;
      const handleWidthMax = handleMax.offsetWidth || 0;
      const clientXMax = rangeRectMax.left + 100 + handleWidthMax/2
      let mousePosInTrackMax = clientXMax - rangeRectMax.left - handleWidthMax / 2;
      let newPositionMax = (mousePosInTrackMax / rangeWidthMax) * 100;
      newPositionMax = Math.max(0, Math.min(newPositionMax, 100));
      const rangeDiffMax = props.max - props.min;
      let newValueMax = props.min + (newPositionMax / 100) * rangeDiffMax;
      fireEvent.mouseMove(document.body, { clientX: clientXMax }); // Usar mouseMove
      fireEvent.mouseUp(document.body); // Usar mouseUp

      expect(onValuesChangeMock).toHaveBeenCalledTimes(2);
  });

});