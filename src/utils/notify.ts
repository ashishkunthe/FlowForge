export async function SendEmail(userEmail: any, plans: any) {
  new Promise((resolve, reject) => {
    setTimeout(() => console.log("EmailSent:", userEmail), 5000);
  })
    .then(() => {
      console.log("email sent");
    })
    .catch((error) => console.log(error));
}
