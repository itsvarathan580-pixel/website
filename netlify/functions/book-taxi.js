const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }

    const body = JSON.parse(event.body);
    const {
        name,
        mobile,
        from,
        to,
        date,
        time,
        tripType,
        bookingId,
        vehicleType,
        pickupState,
        dropState,
        fromSubDistrict,
        toSubDistrict,
        pincode,
        specialRequests,
        pickupAddress,
        dropAddress
    } = body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        // Dynamic logic for labels based on tab
        let categoryLabel = "Journey Details";
        let firstRowLabel = "Pickup Address";
        let secondRowLabel = "Drop Address";
        let showDistrictInfo = true;

        if (tripType === "tours") {
            categoryLabel = "Tour Package Details";
            firstRowLabel = "Selected Tour";
            secondRowLabel = "Number of Travelers";
            showDistrictInfo = false;
        } else if (tripType === "rental") {
            categoryLabel = "Rental Service Details";
            firstRowLabel = "City";
            secondRowLabel = "Package Duration";
            showDistrictInfo = false;
        }

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f0f2f5; }
            .wrapper { background-color: #f0f2f5; padding: 40px 10px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border: 1px solid rgba(225, 29, 72, 0.1); }
            .header { background: #1e293b; color: white; padding: 50px 20px; text-align: center; position: relative; }
            .header::after { content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #e11d48, #be123c); }
            .header h1 { margin: 0; font-size: 28px; letter-spacing: 4px; text-transform: uppercase; font-weight: 800; }
            .header p { margin: 12px 0 0; opacity: 0.7; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; }
            .content { padding: 40px; }
            .badge { display: inline-block; background: #fff1f2; color: #e11d48; padding: 8px 20px; border-radius: 100px; font-size: 12px; font-weight: 700; margin-bottom: 30px; border: 1px solid rgba(225, 29, 72, 0.2); }
            .section { margin-bottom: 35px; }
            .section-label { font-size: 11px; font-weight: 800; color: #e11d48; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; display: block; }
            .data-card { background: #f8fafc; border-radius: 16px; padding: 25px; border: 1px solid #e2e8f0; }
            .data-row { margin-bottom: 15px; border-bottom: 1px solid #edf2f7; padding-bottom: 10px; }
            .data-row:last-child { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
            .data-label { font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
            .data-value { font-size: 16px; font-weight: 600; color: #1e293b; }
            .highlight-text { color: #e11d48; font-weight: 700; }
            .footer { text-align: center; padding: 40px 20px; background: #1e293b; color: rgba(255,255,255,0.6); font-size: 12px; }
            .footer p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>WINFLY DROP TAXI</h1>
                <p>New Booking Notification</p>
              </div>
              
              <div class="content">
                <div style="text-align: center;">
                  <div class="badge">BOOKING ID: ${bookingId || "INTERNAL"}</div>
                </div>

                <div class="section">
                  <span class="section-label">Passenger Information</span>
                  <div class="data-card">
                    <table width="100%">
                      <tr>
                        <td>
                          <div class="data-label">Full Name</div>
                          <div class="data-value">${name}</div>
                        </td>
                        <td align="right">
                          <div class="data-label">Mobile Number</div>
                          <div class="data-value">${mobile}</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>

                <div class="section">
                  <span class="section-label">${categoryLabel}</span>
                  <div class="data-card">
                    <div class="data-row">
                      <div class="data-label">${firstRowLabel}</div>
                      <div class="data-value">${from} ${fromSubDistrict ? `(${fromSubDistrict})` : ""}</div>
                    </div>
                    <div class="data-row">
                      <div class="data-label">${secondRowLabel}</div>
                      <div class="data-value">${to} ${toSubDistrict ? `(${toSubDistrict})` : ""}</div>
                    </div>
                    ${showDistrictInfo ? `
                    <div class="data-row">
                      <div class="data-label">Pickup State</div>
                      <div class="data-value">${pickupState || "—"}</div>
                    </div>
                    <div class="data-row">
                      <div class="data-label">Drop State</div>
                      <div class="data-value">${dropState || "—"}</div>
                    </div>
                    ` : ""}
                  </div>
                </div>

                <div class="section">
                  <span class="section-label">Schedule & Service</span>
                  <div class="data-card">
                    <table width="100%">
                      <tr>
                        <td>
                          <div class="data-label">Travel Date</div>
                          <div class="data-value">${date}</div>
                        </td>
                        <td>
                          <div class="data-label">Pickup Time</div>
                          <div class="data-value highlight-text">${time}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 15px;">
                          <div class="data-label">Booking Type</div>
                          <div class="data-value" style="text-transform: capitalize;">${tripType.replace("-", " ")}</div>
                        </td>
                        <td align="right" style="padding-top: 15px;">
                          <div class="data-label">Vehicle Selected</div>
                          <div class="data-value highlight-text" style="text-transform: uppercase;">${vehicleType || "Executive"}</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>

                ${showDistrictInfo ? `
                <div class="section">
                  <span class="section-label">Address Logs</span>
                  <div class="data-card">
                    <div class="data-row">
                      <div class="data-label">Pickup Location</div>
                      <div class="data-value" style="font-size: 14px;">${pickupAddress || "N/A"}</div>
                    </div>
                    <div class="data-row">
                      <div class="data-label">Pincode</div>
                      <div class="data-value">${pincode || "—"}</div>
                    </div>
                    <div class="data-row">
                      <div class="data-label">Drop Location</div>
                      <div class="data-value" style="font-size: 14px;">${dropAddress || "N/A"}</div>
                    </div>
                  </div>
                </div>
                ` : ""}

                <div class="section">
                  <span class="section-label">Special Requests</span>
                  <div class="data-card">
                    <div class="data-value" style="font-style: italic; color: #e11d48; font-size: 14px;">"${specialRequests || "No special requests."}"</div>
                  </div>
                </div>
              </div>

              <div class="footer">
                <p><strong>WINFLY DROP TAXI & TAXI SERVICE</strong></p>
                <p>© ${new Date().getFullYear()} GLOBAL DISPATCH CENTER</p>
              </div>
            </div>
          </div>
        </body>
        </html>
    `;

        await transporter.sendMail({
            from: `"WINFLY DROP TAXI" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `🚨 New ${tripType.toUpperCase()} Booking: ${name}`,
            html: htmlContent,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Email sent successfully" }),
        };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
};
