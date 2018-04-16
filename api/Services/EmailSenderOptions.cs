using System;
using System.Text.RegularExpressions;

namespace aspnetCoreReactTemplate.Services
{
  public class EmailSenderOptions
  {
    private string _smtpConfig { get; set; }
    public string smtpConfig
    {
      get { return this._smtpConfig; }
      set
      {
        this._smtpConfig = value;

        // smtpConfig is in username:password@localhost:1025 format; extract the part
        var smtpConfigPartsRegEx = new Regex(@"(.*)\:(.*)@(.+)\:(.+)");
        var smtpConfigPartsMatch = smtpConfigPartsRegEx.Match(value);

        this.username = smtpConfigPartsMatch.Groups[1].Value;
        this.password = smtpConfigPartsMatch.Groups[2].Value;
        this.host = smtpConfigPartsMatch.Groups[3].Value;
        this.port = Convert.ToInt32(smtpConfigPartsMatch.Groups[4].Value);
      }
    }

    public string emailFromName { get; set; }
    public string emailFromAddress { get; set; }
    public bool enableSSL { get; set; }
    public string username { get; protected set; }
    public string password { get; protected set; }
    public string host { get; protected set; }
    public int port { get; protected set; }
  }
}
