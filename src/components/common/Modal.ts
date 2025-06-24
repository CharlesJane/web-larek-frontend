import { IModalData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter, IEvents } from "../base/events";

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _modalContent: HTMLElement;
    private _events: IEvents;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._events = events;
        
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._modalContent = ensureElement<HTMLElement>('.modal__content', container);

        this._initEvents();
    }

    private _initEvents() {
        // Подписываемся на события один раз при инициализации
        this._events.on('modal:open', this._handleOpen.bind(this));
        this._events.on('modal:close', this._handleClose.bind(this));

        this._closeButton.addEventListener('click', this.close.bind(this), { passive: false });
        this.container.addEventListener('click', this._handleContainerClick.bind(this), { passive: false });
    }
    
    private _handleContainerClick(event: Event) {
        // Закрываем только если клик был не по контенту
        if (!this._modalContent.contains(event.target as HTMLElement)) {
            this.close();
        }
    }

    private _handleOpen() {
        this.container.classList.add('modal_active');
    }

    private _handleClose() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this._modalContent.replaceChildren();
    }

    set content(value: HTMLElement) {
        this._modalContent.replaceChildren(value);
    }

    open() {
        this._events.emit('modal:open');
    }

    close() {
        this._events.emit('modal:close');
        this._handleClose();
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}