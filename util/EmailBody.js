const VerificationEmailBody = (OTPCode) => {
	return`<!DOCTYPE html>
     <html lang="en">
          <head>
               <meta charset="UTF-8" />
               <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
               <meta name="viewport" content="width=device-width, initial-scale=1.0" />
               <meta name="color-scheme" content="light dark" />
               <meta name="supported-color-schemes" content="light dark" />
               <title>Document</title>
               <style type="text/css">
                    @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap");
                    * {
                         padding: 0;
                         margin: 0;
                    }
                    .main {
                         max-width: 767px;
                         background-image: url(https://ibb.co/jVYG8xH);
                    }
                    img {
                         width: 100%;
                         height: 100%;
                    }
                    table,
                    tbody,
                    tr,
                    td {
                         padding: 0;
                         margin: 0;
                    }
     
                    .button {
                         padding: 5px 40px;
                         border-radius: 50px;
                         height: 55px;
     
                         background-color: #0c0a0a;
     
                         font-family: "Montserrat", sans-serif;
                         font-size: 25px;
                         letter-spacing: 8px;
                         color: #f5f3f4;
                         font-weight: 500;
                         border: 0;
                         outline: 0;
                         text-align: center;
                    }
                    @media (prefers-color-scheme: dark) {
                         .wrapper {
                              background-color: #fff !important;
                         }
                         .main {
                              background-color: #fff !important;
                         }
                    }
               </style>
          </head>
     
          <body>
               <center
                    class="wrapper"
                    style="background-image: url('https://ibb.co/jVYG8xH')">
                    <table
                         class="main"
                         cellpadding="0"
                         cellspacing="0"
                         height="100%"
                         width="100%">
                         <tbody>
                              <tr>
                                   <td>
                                        <table width="100%">
                                             <tbody>
                                                  <img
                                                       src="https://i.ibb.co/s249vjv/image-one.jpg"
                                                       alt="the main image of the mail" />
                                             </tbody>
                                        </table>
                                   </td>
                              </tr>
                              <tr>
                                   <td>
                                        <table
                                             width="100%"
                                             style="
                                                  padding: 60px 0;
                                                  background-image: url('https://ibb.co/jVYG8xH');
                                                  background-color: #fff;
                                             ">
                                             <tbody style="background-color: #fff">
                                                  <center style="background-color: #fff">
                                                       <tr style="background-color: #fff">
                                                            <td style="background-color: #fff">
                                                                 <center style="background-color: #fff">
                                                                      <button class="button">${OTPCode}</button>
                                                                      <p style="display: none">
                                                                           Lorem ipsum dolor sit amet consectetur adipisicing
                                                                           elit. Quidem quo ipsa natus ducimus veniam dicta
                                                                           enim beatae qui error a quasi saepe vel dignissimos,
                                                                           sint distinctio provident asperiores sed id!
                                                                      </p>
                                                                 </center>
                                                            </td>
                                                       </tr>
                                                  </center>
                                             </tbody>
                                        </table>
                                   </td>
                              </tr>
                              <tr>
                                   <td>
                                        <table width="100%">
                                             <tbody>
                                                  <img src="https://i.ibb.co/s3qSqGX/footer.jpg" alt="" />
                                             </tbody>
                                        </table>
                                   </td>
                              </tr>
                         </tbody>
                    </table>
               </center>
          </body>
     </html>
     `;
};

module.exports = VerificationEmailBody;
