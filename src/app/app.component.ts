import {
  Component,
  ViewChild,
  Input,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'my-app',
  template: `
    <div style="width:100%;">
      <canvas id="myChart" width="350" height="250" #mychart></canvas>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, AfterViewInit {
  name = 'Angular   6';
  @Input() colors = ['#5b646f', '#ffae50', '#e14747'];
  @Input() data = [200, 300, 500];
  canvas: any;
  ctx: any;
  doughnutChartRef;
  @ViewChild('mychart') mychart;

  ngAfterViewInit() {
    Chart.pluginService.register({
      beforeDraw: function(chart) {
        if (chart.config.options.elements.center) {
          //Get ctx from string
          const ctx = chart.chart.ctx;

          //Get options from the center object in options
          const centerConfig = chart.config.options.elements.center;
          const fontStyle = centerConfig.fontStyle || 'Arial';
          const txt = centerConfig.text;
          const color = centerConfig.color || '#000';
          const sidePadding = centerConfig.sidePadding || 20;
          const sidePaddingCalculated =
            (sidePadding / 100) * (chart.innerRadius * 2);
          //Start with a base font of 30px
          ctx.font = '30px ' + fontStyle;

          //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          const stringWidth = ctx.measureText(txt).width;
          const elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

          // Find out how much the font can grow in width.
          const widthRatio = elementWidth / stringWidth;
          const newFontSize = Math.floor(30 * widthRatio);
          const elementHeight = chart.innerRadius * 2;

          // Pick a new font size so it will not be larger than the height of label.
          const fontSizeToUse = Math.min(newFontSize, elementHeight);

          //Set font settings to draw it correctly.
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          ctx.font = fontSizeToUse + 'px ' + fontStyle;
          ctx.fillStyle = color;

          //Draw text in center
          ctx.fillText(txt, centerX, centerY);
        }
      }
    });

    this.canvas = this.mychart.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    this.doughnutChartRef = new Chart(this.ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            borderWidth: 6,
            weight: 20,
            hoverBorderWidth: 1,
            data: this.data,
            backgroundColor: this.colors
          }
        ]
      },
      options: {
        cutoutPercentage: 90,
        hover: {
          mode: ''
        },
        tooltips: {
          mode: ''
        },
        elements: {
          center: {
            text: 'MANAGED STATE',
            color: '#5b646f', // Default is #000000
            fontStyle: 'Arial', // Default is Arial
            sidePadding: 20 // Defualt is 20 (as a percentage)
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.doughnutChartRef.destroy();
  }
}
