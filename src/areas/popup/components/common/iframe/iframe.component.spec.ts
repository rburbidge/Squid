import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { IFrameComponent } from './iframe.component';
import { ChromeExtensionLinkDirective } from '../../../../common/directives/chrome-ext/link/link.directive';
import { loadCss } from '../../testing/css-loader';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { WindowService } from '../../../services/window.service';

describe('IFrameComponent', () => {
    let window: WindowService;

    let comp: IFrameComponent;
    let fixture: ComponentFixture<IFrameComponent>;

    beforeAll(() => {
        loadCss([
            'areas/popup/components/toolbar/toolbar.css',
            'areas/popup/components/options/instructions/instructions.css']);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ IFrameComponent, ToolbarComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: WindowService, useValue: new WindowService() }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        window = TestBed.get(WindowService);

        fixture = TestBed.createComponent(IFrameComponent);
        comp = fixture.componentInstance;
    });

    it('iframe height is set on window heightChanged message', () => {
        fixture = TestBed.createComponent(IFrameComponent);
        fixture.detectChanges();
        
        const message: MessageEvent = {
            data: {
                type: 'heightChanged',
                data: '25px'
            }
        } as MessageEvent;

        comp.onWindowMessage(message);
        expect(comp.contentHeight).toBe('25px');
    });
});