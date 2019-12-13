using System;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using aspnetCoreReactTemplate.Models;
using aspnetCoreReactTemplate.Services;
using aspnetCoreReactTemplate.ViewModels;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace aspnetCoreReactTemplate.Controllers
{
    public class AuthController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IOptions<IdentityOptions> _identityOptions;
        private readonly JwtOptions _jwtOptions;
        private readonly IEmailSender _emailSender;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger _logger;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            IOptions<IdentityOptions> identityOptions,
            IOptions<JwtOptions> jwtOptions,
            IEmailSender emailSender,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory)
        {
            _userManager = userManager;
            _identityOptions = identityOptions;
            _jwtOptions = jwtOptions.Value;
            _emailSender = emailSender;
            _signInManager = signInManager;
            _logger = loggerFactory.CreateLogger<AuthController>();
        }

        [AllowAnonymous]
        [HttpPost("~/api/auth/login")]
        [Produces("application/json")]
        public async Task<IActionResult> Login(string username, string password)
        {
            // Ensure the username and password is valid.
            var user = await _userManager.FindByNameAsync(username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, password))
            {
                return BadRequest(new
                {
                    error = "", //OpenIdConnectConstants.Errors.InvalidGrant,
                    error_description = "The username or password is invalid."
                });
            }

            // Ensure the email is confirmed.
            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                return BadRequest(new
                {
                    error = "email_not_confirmed",
                    error_description = "You must have a confirmed email to log in."
                });
            }

            _logger.LogInformation($"User logged in (id: {user.Id})");

            // Generate and issue a JWT token
            var claims = new [] {
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
              };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
              issuer: _jwtOptions.issuer,
              audience: _jwtOptions.issuer,
              claims: claims,
              expires: DateTime.Now.AddMinutes(30),
              signingCredentials: creds);

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }

        [AllowAnonymous]
        [HttpPost("~/api/auth/register")]
        public async Task<IActionResult> Register(NewUser model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser { UserName = model.username, Email = model.username };
            var result = await _userManager.CreateAsync(user, model.password);
            if (result.Succeeded)
            {
                _logger.LogInformation($"New user registered (id: {user.Id})");

                if (!user.EmailConfirmed)
                {
                    // Send email confirmation email
                    var confirmToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    var emailConfirmUrl = Url.RouteUrl("ConfirmEmail", new { uid = user.Id, token = confirmToken }, this.Request.Scheme);
                    await _emailSender.SendEmailAsync(model.username, "Please confirm your account",
    $"Please confirm your account by clicking this <a href=\"{emailConfirmUrl}\">link</a>."
                    );

                    _logger.LogInformation($"Sent email confirmation email (id: {user.Id})");
                }

                // Create a new authentication ticket.
                //var ticket = await CreateTicket(user);

                _logger.LogInformation($"User logged in (id: {user.Id})");

                return Ok();
            }
            else
            {
                return BadRequest(new { general = result.Errors.Select(x => x.Description) });
            }
        }

        [AllowAnonymous]
        [HttpGet("~/api/auth/confirm", Name = "ConfirmEmail")]
        public async Task<IActionResult> Confirm(string uid, string token)
        {
            var user = await _userManager.FindByIdAsync(uid);
            var confirmResult = await _userManager.ConfirmEmailAsync(user, token);
            if (confirmResult.Succeeded)
            {
                return Redirect("/?confirmed=1");
            }
            else
            {
                return Redirect("/error/email-confirm");
            }
        }
    }
}
