import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver'
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private _MessageService:MessageService ) { }

  sidebar_state:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  overlayStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  breadCrumbTitle:BehaviorSubject<string> = new BehaviorSubject<string>('');


  exportToExcel(data: any[], fileName: string): void {
    // تحويل البيانات إلى ورقة عمل
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // إنشاء workbook وإضافة الورقة
    const workbook: XLSX.WorkBook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };

    // تحويل الـ workbook إلى buffer
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // حفظ الملف
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  // دالة مساعدة لحفظ الملف
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(data, fileName + '_export_' + '.xlsx');
              this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'File Downloaded Successfully' })

  }
}
