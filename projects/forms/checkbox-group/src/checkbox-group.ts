import { FormBuilder, FormControl } from "@angular/forms";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { merge, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Option } from "./api";

interface OptionItem {
    control: FormControl;
    data: Option;
}

@Component({
    selector: 'tsmp-forms-checkbox-group',
    templateUrl: './checkbox-group.html',
    styleUrls: ['./checkbox-group.scss']
})
export class CheckboxGroup implements OnInit, OnDestroy {

    @Output()
    valueChange: EventEmitter<any> = new EventEmitter();

    /**
     * if true multi select is enabled, default = true
     *
     */
    @Input()
    public multi = true;

    /**
     * all items we have
     * 
     */
    public items: OptionItem[] = [];

    /**
     * emits true if component gets destroyed to unsubscribe
     *
     */
    private changeSubscription: Subscription;

    /**
     * selected items
     *
     */
    private selected: OptionItem[] = [];

    @Input()
    set options(options: Option[]) {
        this.items = options.map((option): OptionItem => {
            return {
                control: this.formBuilder.control(''),
                data: option
            }
        });
    }

    constructor(
        private formBuilder: FormBuilder
    ) {}

    /**
     * when component gets intialized create a change stream for all form controls we have
     * added and merge them together.
     *
     */
    ngOnInit(): void {
        const optionChange$ = this.items.map(
            (option) => option.control.valueChanges.pipe(map(() => option)));

        this.changeSubscription = merge(...optionChange$)
            .subscribe((option) => this.handleOptionChange(option));
    }

    /**
     * component gets destroyed, clear up all data and unsubscribe from change
     *
     */
    ngOnDestroy(): void {
        this.changeSubscription.unsubscribe();
        this.changeSubscription = null;

        this.selected = [];
        this.options = [];
    }

    /**
     * option has been changed
     *
     */
    private handleOptionChange(option: OptionItem) {
        option.control.value ? this.addItem(option) : this.removeItem(option);
        const selected = this.selected.reduce(
            (items: Option[], item) => items.concat(item.data), []);

        this.valueChange.emit(selected);
    }

    /**
     * add new item to selected list
     *
     */
    private addItem(item: OptionItem) {
        if (!this.multi && this.selected.length) {
            this.selected[0].control.setValue(false, {emitEvent: false, onlySelf: true});
        }
        this.selected = this.multi ? this.selected.concat(item) : [item];
    }

    /**
     * remove an item from selected list
     *
     */
    private removeItem(item: OptionItem) {
        this.selected = this.selected.filter((option) => option !== item);
    }
}
