import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
  username: string | null = '';
  balance: number  = 0;
  depositAmount: number = 0;
  totalDepositAmount: number = 0;
  totalWithdrawAmount:number=0;
  withdrawAmount:number=0;
  transferAmount: number = 0;
  recipientEmail: string = '';
  constructor(private http: HttpClient,private toastr: ToastrService) { 
    this.username = localStorage.getItem('username');
  }

  ngOnInit(): void {
    if (this.username) {
      this.http.get<any>(`http://localhost:3000/users/${this.username}`).subscribe(
        (response) => {
          this.balance = response.balance; // Assuming the balance is returned in the response
          console.log(response.balance,'======')
        },
        (error) => {
          console.error('Error occurred: ', error);
        }
      );
    }
  }

  deposit(): void {
    const depositData = {
      username: this.username,
      depositAmount: this.depositAmount
    };

    this.http.post<any>('http://localhost:3000/users/deposit', depositData).subscribe(
      (response) => {
        if (response.success) {
          this.balance = this.balance! + this.depositAmount;
          this.totalDepositAmount += this.depositAmount; // Accumulate the deposit amounts
          // Reset the deposit amount input to 0
          this.depositAmount = 0;
          this.toastr.success('Sucessfull');
        }
      },
      (error) => {
        console.error('Error occurred: ', error);
      }
    );
  }
  withdraw(): void {
    const withdrawData = {
      username: this.username,
      withdrawAmount: this.withdrawAmount
    };
    if(this.withdrawAmount>this.balance){
      this.toastr.error("You don't have that much balance to withdraw");
    }
    else if(this.withdrawAmount<=0){
      this.toastr.error("Invalid Withdraw Amount");
    }
    else{
      this.http.post<any>('http://localhost:3000/users/withdraw', withdrawData).subscribe(
        (response) => {
          if (response.success) {
            this.balance = this.balance! - this.withdrawAmount;
            this.totalWithdrawAmount += this.withdrawAmount; // Accumulate the deposit amounts
            // Reset the deposit amount input to 0
            this.withdrawAmount = 0;
            this.toastr.success('Sucessfull');
          }
        },
        (error) => {
          console.error('Error occurred: ', error);
        }
      );
    }
    }

    transfer(): void {
      const transferData = {
        senderUsername: this.username,
        recipientEmail: this.recipientEmail,
        transferAmount: this.transferAmount
      };
  
      this.http.post<any>('http://localhost:3000/users/transfer', transferData).subscribe(
        (response) => {
          if (response.success) {
            this.balance = this.balance! - this.transferAmount;
            // Reset the transfer input fields to empty
            this.toastr.success('Your Transfer was done sucessfully');
            this.transferAmount = 0;
            this.recipientEmail = '';
          }
        },
        (error) => {
          console.error('Error occurred: ', error);
          this.toastr.error(error.error, 'Transfer Error'); // Display error message using toastr
        }
      );
    }
    
}
