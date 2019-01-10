import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialogRef } from '@angular/material';
import { merge } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { TableDataSource } from '../../shared/table-data-source';
import { ContatoService } from '../contato.service';

@Component({
  selector: 'eia-contato-select',
  templateUrl: './contato-select.component.html',
  styleUrls: ['./contato-select.component.scss'],
  animations: [
    trigger('toggleSearch', [
      state('hidden', style({
        opacity: 0,
        'max-height': '0px'
      })),
      state('visible', style({
        opacity: 1,
        'max-height': '70px',
        'margin-top': '20px'
      })),
      transition('* => *', animate('250ms 0s ease-in-out'))
    ])
  ]
})
export class ContatoSelectComponent  implements OnInit, AfterViewInit {

  searchBarState = 'hidden';
  searchForm: FormGroup;
  searchControl: FormControl;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['nome', 'municipio', 'uf', 'fone', 'fantasia', 'celular', 'actions'];

  dataSource: TableDataSource;

  props = {
    pageIndex: 0,
    pageSize: 8,
    sortBy: 'nome',
    filter: ''
  };

  constructor(
    private fb: FormBuilder,
    private service: ContatoService,
    private dialogRef: MatDialogRef<ContatoSelectComponent>) {}

  ngOnInit() {
    this.searchControl = this.fb.control('');
    this.searchForm = this.fb.group({
      searchControl: this.searchControl
    });

    this.searchControl.valueChanges
    .pipe(
      debounceTime(600),
      distinctUntilChanged(),
      map(searchTerm => {
        this.props.filter = searchTerm;
        if (searchTerm === '') {
          this.toggleSearch();
        }
        return this.props;
      }
      )
    ).subscribe(() => {
      this.loadPage();
    });

    this.dataSource = new TableDataSource(this.service);
    this.dataSource.loadRegisters(this.props);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadPage()))
      .subscribe();
  }

  toggleSearch() {
    this.searchBarState = this.searchBarState === 'hidden' ? 'visible' : 'hidden';
  }

  loadPage() {
    this.props.pageIndex = this.paginator.pageIndex;
    this.dataSource.loadRegisters(this.props);
  }

  select(registro) {
    this.dialogRef.close(registro);
  }

  close() {
    this.dialogRef.close();
  }

}