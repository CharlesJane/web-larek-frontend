import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _closeButton: HTMLElement;
    protected _totalPayed: HTMLParagraphElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._closeButton = ensureElement<HTMLElement>('.state__action', this.container);
        this._totalPayed = ensureElement<HTMLParagraphElement>('.order-success__description', this.container)

        if (actions?.onClick) {
            this._closeButton.addEventListener('click', actions.onClick);
        }
    }

    set totalPayed(total: number) {
        this.setText(this._totalPayed, `Списано ${total} синапсов`);
    }
}