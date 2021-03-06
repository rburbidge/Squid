import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ChromeService } from '../../services/chrome.service';
import { loadCss } from '../testing/css-loader';
import { MockChromeService } from '../../services/testing/chrome.service.mock';
import { OptionsComponent } from './options.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

describe('OptionsComponent', () => {
    let comp: OptionsComponent;
    let fixture: ComponentFixture<OptionsComponent>;

    beforeAll(() => {
        loadCss([
            'areas/popup/components/toolbar/toolbar.css',
            'areas/popup/components/options/options.css']);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ OptionsComponent, ToolbarComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: ChromeService, useValue: new MockChromeService() }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OptionsComponent);
        comp = fixture.debugElement.componentInstance;
    });
});